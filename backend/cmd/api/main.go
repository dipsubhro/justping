package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"justping/backend/internal/database"
	"justping/backend/internal/handlers"
	"log"
	"net/http"
	"os"
)

type WatchRequest struct {
	URL string `json:"url"`
}

type DebugResponse struct {
	ReceivedURL          string `json:"received_url"`
	ChangeDetectionURL   string `json:"changedetection_url"`
	ChangeDetectionStatus int    `json:"changedetection_status"`
	ChangeDetectionBody  string `json:"changedetection_body"`
	Error                string `json:"error,omitempty"`
}

func main() {
	// Connect to MongoDB
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017" // default
	}
	if err := database.Connect(mongoURI); err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer database.Disconnect()

	// Monitor API routes
	http.HandleFunc("/api/monitors", handlers.ListMonitors)
	http.HandleFunc("/api/monitors/create", handlers.CreateMonitor)
	http.HandleFunc("/api/monitors/", handlers.MonitorByID)

	// Alert API routes
	http.HandleFunc("/api/webhook", handlers.HandleWebhook)
	http.HandleFunc("/api/alerts", handlers.ListAlerts)
	http.HandleFunc("/api/alerts/mark-checked", handlers.MarkAlertsAsChecked)

	// Existing watch route
	http.HandleFunc("/api/watch", handleWatch)
	
	port := "3002"
	log.Printf("Server starting on port %s\n", port)
	log.Printf("Monitor API: http://localhost:%s/api/monitors\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}

func handleWatch(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers for all requests
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Handle preflight OPTIONS request
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Only accept POST
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse request body
	var req WatchRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error decoding request: %v\n", err)
		respondWithDebug(w, DebugResponse{
			Error: fmt.Sprintf("Invalid JSON: %v", err),
		}, http.StatusBadRequest)
		return
	}

	log.Printf("Received URL: %s\n", req.URL)

	// Forward to changedetection.io
	changeDetectionURL := "http://localhost:5000/api/v1/watch"
	payload, _ := json.Marshal(map[string]string{"url": req.URL})
	
	httpReq, err := http.NewRequest("POST", changeDetectionURL, bytes.NewBuffer(payload))
	if err != nil {
		log.Printf("Error creating request: %v\n", err)
		respondWithDebug(w, DebugResponse{
			ReceivedURL: req.URL,
			Error:       fmt.Sprintf("Request creation failed: %v", err),
		}, http.StatusInternalServerError)
		return
	}

	// Set headers
	httpReq.Header.Set("Content-Type", "application/json")
	apiKey := os.Getenv("CHANGEDETECTION_API_KEY")
	if apiKey == "" {
		apiKey = "your-api-key-here" // fallback
	}
	httpReq.Header.Set("x-api-key", apiKey)

	// Send request
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		log.Printf("Error forwarding to changedetection.io: %v\n", err)
		respondWithDebug(w, DebugResponse{
			ReceivedURL:        req.URL,
			ChangeDetectionURL: changeDetectionURL,
			Error:              fmt.Sprintf("Forward failed: %v", err),
		}, http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	// Read response body
	body, _ := io.ReadAll(resp.Body)
	bodyStr := string(body)

	log.Printf("ChangeDetection Status: %d\n", resp.StatusCode)
	log.Printf("ChangeDetection Response: %s\n", bodyStr)

	// Return debug response
	respondWithDebug(w, DebugResponse{
		ReceivedURL:           req.URL,
		ChangeDetectionURL:    changeDetectionURL,
		ChangeDetectionStatus: resp.StatusCode,
		ChangeDetectionBody:   bodyStr,
	}, http.StatusOK)
}

func respondWithDebug(w http.ResponseWriter, debug DebugResponse, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*") // Enable CORS for frontend
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(debug)
}
