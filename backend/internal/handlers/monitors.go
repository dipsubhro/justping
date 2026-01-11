package handlers

import (
	"context"
	"encoding/json"
	"justping/backend/internal/auth"
	"justping/backend/internal/database"
	"justping/backend/internal/models"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
}

// ListMonitors handles GET /api/monitors
func ListMonitors(w http.ResponseWriter, r *http.Request) {
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
		log.Printf("Auth error: %v", err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	log.Printf("Fetching monitors for user: %s", userID)

	// Query MongoDB for user's monitors
	collection := database.GetMonitorsCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"userId": userID})
	if err != nil {
		log.Printf("Database error: %v", err)
		http.Error(w, "Failed to fetch monitors", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var monitors []models.Monitor
	if err = cursor.All(ctx, &monitors); err != nil {
		log.Printf("Cursor error: %v", err)
		http.Error(w, "Failed to parse monitors", http.StatusInternalServerError)
		return
	}

	// Return empty array if no monitors
	if monitors == nil {
		monitors = []models.Monitor{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(monitors)
}

// CreateMonitor handles POST /api/monitors/create
func CreateMonitor(w http.ResponseWriter, r *http.Request) {
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
		log.Printf("Auth error: %v", err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Parse request body
	var req models.CreateMonitorRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.WebsiteName == "" || req.TargetType == "" || req.URL == "" {
		http.Error(w, "Missing required fields: websiteName, targetType, url", http.StatusBadRequest)
		return
	}

	// Set default frequency if not provided
	if req.Frequency.Value == 0 {
		req.Frequency = models.Frequency{Value: 5, Unit: "minutes"}
	}

	// Create monitor document
	now := time.Now()
	monitor := models.Monitor{
		ID:          primitive.NewObjectID(),
		UserID:      userID,
		WebsiteName: req.WebsiteName,
		TargetType:  req.TargetType,
		URL:         req.URL,
		Selector:    req.Selector,
		Status:      "active",
		LastChecked: now,
		Frequency:   req.Frequency,
		HasChanged:  false,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	// Insert into MongoDB
	collection := database.GetMonitorsCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := collection.InsertOne(ctx, monitor)
	if err != nil {
		log.Printf("Database error: %v", err)
		http.Error(w, "Failed to create monitor", http.StatusInternalServerError)
		return
	}

	log.Printf("Created monitor %v for user %s", result.InsertedID, userID)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(monitor)
}

// MonitorByID handles GET/PUT/DELETE /api/monitors/:id
func MonitorByID(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Extract ID from URL path
	path := strings.TrimPrefix(r.URL.Path, "/api/monitors/")
	if path == "" || path == "create" {
		http.Error(w, "Invalid monitor ID", http.StatusBadRequest)
		return
	}

	monitorID, err := primitive.ObjectIDFromHex(path)
	if err != nil {
		http.Error(w, "Invalid monitor ID format", http.StatusBadRequest)
		return
	}

	// Verify session
	authServiceURL := os.Getenv("AUTH_SERVICE_URL")
	if authServiceURL == "" {
		authServiceURL = "http://localhost:8787"
	}

	userID, err := auth.VerifySession(r, authServiceURL)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	switch r.Method {
	case http.MethodGet:
		getMonitorByID(w, r, monitorID, userID)
	case http.MethodPut:
		updateMonitor(w, r, monitorID, userID)
	case http.MethodDelete:
		deleteMonitor(w, r, monitorID, userID)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func getMonitorByID(w http.ResponseWriter, r *http.Request, monitorID primitive.ObjectID, userID string) {
	collection := database.GetMonitorsCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var monitor models.Monitor
	err := collection.FindOne(ctx, bson.M{"_id": monitorID, "userId": userID}).Decode(&monitor)
	if err != nil {
		http.Error(w, "Monitor not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(monitor)
}

func updateMonitor(w http.ResponseWriter, r *http.Request, monitorID primitive.ObjectID, userID string) {
	var updateReq models.CreateMonitorRequest
	if err := json.NewDecoder(r.Body).Decode(&updateReq); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Build update document
	update := bson.M{
		"$set": bson.M{
			"updatedAt": time.Now(),
		},
	}

	if updateReq.WebsiteName != "" {
		update["$set"].(bson.M)["websiteName"] = updateReq.WebsiteName
	}
	if updateReq.TargetType != "" {
		update["$set"].(bson.M)["targetType"] = updateReq.TargetType
	}
	if updateReq.URL != "" {
		update["$set"].(bson.M)["url"] = updateReq.URL
	}
	if updateReq.Selector != "" {
		update["$set"].(bson.M)["selector"] = updateReq.Selector
	}
	if updateReq.Frequency.Value > 0 {
		update["$set"].(bson.M)["frequency"] = updateReq.Frequency
	}

	collection := database.GetMonitorsCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := collection.UpdateOne(ctx, bson.M{"_id": monitorID, "userId": userID}, update)
	if err != nil {
		http.Error(w, "Failed to update monitor", http.StatusInternalServerError)
		return
	}

	if result.MatchedCount == 0 {
		http.Error(w, "Monitor not found", http.StatusNotFound)
		return
	}

	// Fetch updated monitor
	var monitor models.Monitor
	collection.FindOne(ctx, bson.M{"_id": monitorID}).Decode(&monitor)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(monitor)
}

func deleteMonitor(w http.ResponseWriter, r *http.Request, monitorID primitive.ObjectID, userID string) {
	collection := database.GetMonitorsCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := collection.DeleteOne(ctx, bson.M{"_id": monitorID, "userId": userID})
	if err != nil {
		http.Error(w, "Failed to delete monitor", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "Monitor not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Monitor deleted successfully"})
}
