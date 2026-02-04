package handlers

import (
	"justping/backend/internal/renderer"
	"log"
	"net/http"
	"strings"
)

// HandleRender serves GET /api/render?url=<encoded-url>
// It renders the target URL in a headless browser and returns sanitized HTML.
func HandleRender(w http.ResponseWriter, r *http.Request) {
	setCORSHeaders(w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	targetURL := r.URL.Query().Get("url")
	if targetURL == "" {
		http.Error(w, "missing required query param: url", http.StatusBadRequest)
		return
	}
	if !strings.HasPrefix(targetURL, "http://") && !strings.HasPrefix(targetURL, "https://") {
		http.Error(w, "url must start with http:// or https://", http.StatusBadRequest)
		return
	}

	log.Printf("[render] rendering %s", targetURL)

	html, err := renderer.RenderPage(targetURL)
	if err != nil {
		log.Printf("[render] error rendering %s: %v", targetURL, err)
		http.Error(w, "failed to render page: "+err.Error(), http.StatusBadGateway)
		return
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(html))
}

// setCORSHeaders sets permissive CORS headers for the response.
func setCORSHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
