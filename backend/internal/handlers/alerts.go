package handlers

import (
	"context"
	"encoding/json"
	"io"
	"justping/backend/internal/auth"
	"justping/backend/internal/database"
	"justping/backend/internal/models"
	"log"
	"net/http"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// HandleWebhook receives webhook POST requests from changedetection.io
// This is a public endpoint - no authentication required
func HandleWebhook(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Read raw body for storage
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Webhook: failed to read body: %v", err)
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}

	// Parse to extract watch_uuid
	var payload map[string]interface{}
	if err := json.Unmarshal(body, &payload); err != nil {
		log.Printf("Webhook: failed to parse JSON: %v", err)
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	watchUUID, ok := payload["watch_uuid"].(string)
	if !ok || watchUUID == "" {
		log.Printf("Webhook: missing watch_uuid in payload")
		http.Error(w, "Missing watch_uuid in payload", http.StatusBadRequest)
		return
	}

	log.Printf("Webhook received for watch_uuid: %s", watchUUID)

	// Find the monitor by changeDetectionUuid
	monitorsCollection := database.GetMonitorsCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var monitor models.Monitor
	err = monitorsCollection.FindOne(ctx, bson.M{"changeDetectionUuid": watchUUID}).Decode(&monitor)
	if err != nil {
		log.Printf("Webhook: no monitor found for watch_uuid %s: %v", watchUUID, err)
		http.Error(w, "Monitor not found for this watch_uuid", http.StatusNotFound)
		return
	}

	// Create alert document
	alert := models.Alert{
		ID:         primitive.NewObjectID(),
		UserID:     monitor.UserID,
		MonitorID:  monitor.ID,
		Checked:    false,
		ReceivedAt: time.Now(),
		Payload:    bson.Raw(body),
	}

	// Insert into alerts collection
	alertsCollection := database.GetAlertsCollection()
	_, err = alertsCollection.InsertOne(ctx, alert)
	if err != nil {
		log.Printf("Webhook: failed to insert alert: %v", err)
		http.Error(w, "Failed to store alert", http.StatusInternalServerError)
		return
	}

	log.Printf("Alert created for user %s, monitor %s", monitor.UserID, monitor.ID.Hex())

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "ok",
		"message": "Alert created successfully",
	})
}

// ListAlerts handles GET /api/alerts - returns alerts for the authenticated user
func ListAlerts(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Verify session and get user ID
	authServiceURL := os.Getenv("AUTH_SERVICE_URL")
	if authServiceURL == "" {
		authServiceURL = "http://localhost:8787"
	}

	userID, err := auth.VerifySession(r, authServiceURL)
	if err != nil {
		log.Printf("Alerts: auth error: %v", err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	log.Printf("Fetching alerts for user: %s", userID)

	// Query alerts sorted by receivedAt DESC
	alertsCollection := database.GetAlertsCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	findOptions := options.Find().SetSort(bson.D{{Key: "receivedAt", Value: -1}})
	cursor, err := alertsCollection.Find(ctx, bson.M{"userId": userID}, findOptions)
	if err != nil {
		log.Printf("Alerts: database error: %v", err)
		http.Error(w, "Failed to fetch alerts", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var alerts []models.Alert
	if err = cursor.All(ctx, &alerts); err != nil {
		log.Printf("Alerts: cursor error: %v", err)
		http.Error(w, "Failed to parse alerts", http.StatusInternalServerError)
		return
	}

	// Build response with parsed payload and monitor name lookup
	monitorsCollection := database.GetMonitorsCollection()
	var response []models.AlertResponse

	for _, alert := range alerts {
		// Parse payload from bson.Raw to map
		var payloadMap map[string]interface{}
		if err := bson.Unmarshal(alert.Payload, &payloadMap); err != nil {
			payloadMap = map[string]interface{}{"raw": string(alert.Payload)}
		}

		// Look up monitor name
		var monitor models.Monitor
		var monitorName string
		if err := monitorsCollection.FindOne(ctx, bson.M{"_id": alert.MonitorID}).Decode(&monitor); err == nil {
			monitorName = monitor.WebsiteName
		}

		response = append(response, models.AlertResponse{
			ID:          alert.ID,
			UserID:      alert.UserID,
			MonitorID:   alert.MonitorID,
			MonitorName: monitorName,
			Checked:     alert.Checked,
			ReceivedAt:  alert.ReceivedAt,
			Payload:     payloadMap,
		})
	}

	// Return empty array if no alerts
	if response == nil {
		response = []models.AlertResponse{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// MarkAlertsAsChecked handles POST /api/alerts/mark-checked
// Marks all unchecked alerts for the user as checked
func MarkAlertsAsChecked(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Verify session and get user ID
	authServiceURL := os.Getenv("AUTH_SERVICE_URL")
	if authServiceURL == "" {
		authServiceURL = "http://localhost:8787"
	}

	userID, err := auth.VerifySession(r, authServiceURL)
	if err != nil {
		log.Printf("MarkAlertsAsChecked: auth error: %v", err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Update all unchecked alerts for this user
	alertsCollection := database.GetAlertsCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := alertsCollection.UpdateMany(
		ctx,
		bson.M{"userId": userID, "checked": false},
		bson.M{"$set": bson.M{"checked": true}},
	)
	if err != nil {
		log.Printf("MarkAlertsAsChecked: database error: %v", err)
		http.Error(w, "Failed to update alerts", http.StatusInternalServerError)
		return
	}

	log.Printf("Marked %d alerts as checked for user %s", result.ModifiedCount, userID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":       "ok",
		"markedCount":  result.ModifiedCount,
	})
}
