package auth

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

type SessionResponse struct {
	User struct {
		ID string `json:"id"`
	} `json:"user"`
}

// VerifySession calls the auth service to verify the session cookie and get the user ID
func VerifySession(r *http.Request, authServiceURL string) (string, error) {
	// Create request to auth service
	req, err := http.NewRequest("GET", authServiceURL+"/api/auth/get-session", nil)
	if err != nil {
		return "", fmt.Errorf("failed to create auth request: %w", err)
	}

	// Forward all cookies from original request
	for _, cookie := range r.Cookies() {
		req.AddCookie(cookie)
	}

	// Send request to auth service
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to call auth service: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read auth response: %w", err)
	}

	// Check if unauthorized
	if resp.StatusCode == 401 || resp.StatusCode == 403 {
		return "", fmt.Errorf("unauthorized")
	}

	if resp.StatusCode != 200 {
		return "", fmt.Errorf("auth service returned status %d: %s", resp.StatusCode, string(body))
	}

	// Parse response
	var sessionResp SessionResponse
	if err := json.Unmarshal(body, &sessionResp); err != nil {
		return "", fmt.Errorf("failed to parse auth response: %w", err)
	}

	if sessionResp.User.ID == "" {
		return "", fmt.Errorf("no user ID in session")
	}

	return sessionResp.User.ID, nil
}
