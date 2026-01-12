package changedetection

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"justping/backend/internal/models"
	"net/http"
)

// Client is a client for the changedetection.io API
type Client struct {
	BaseURL string
	APIKey  string
}

// TimeBetweenCheck represents the time interval for checking
type TimeBetweenCheck struct {
	Weeks   int `json:"weeks,omitempty"`
	Days    int `json:"days,omitempty"`
	Hours   int `json:"hours,omitempty"`
	Minutes int `json:"minutes,omitempty"`
	Seconds int `json:"seconds,omitempty"`
}

// CreateWatchRequest represents the request to create a watch
type CreateWatchRequest struct {
	URL                string            `json:"url"`
	Title              string            `json:"title,omitempty"`
	TimeBetweenCheck   *TimeBetweenCheck `json:"time_between_check,omitempty"`
	Paused             bool              `json:"paused,omitempty"`
	NotificationMuted  bool              `json:"notification_muted,omitempty"`
}

// NewClient creates a new changedetection.io client
func NewClient(baseURL, apiKey string) *Client {
	return &Client{
		BaseURL: baseURL,
		APIKey:  apiKey,
	}
}

// MapFrequencyToTimeBetweenCheck converts our Frequency model to changedetection.io format
func MapFrequencyToTimeBetweenCheck(freq models.Frequency) *TimeBetweenCheck {
	tbc := &TimeBetweenCheck{}
	
	switch freq.Unit {
	case "minutes":
		tbc.Minutes = freq.Value
	case "hours":
		tbc.Hours = freq.Value
	case "days":
		tbc.Days = freq.Value
	}
	
	return tbc
}

// CreateWatch creates a new watch on changedetection.io
func (c *Client) CreateWatch(req CreateWatchRequest) (string, error) {
	url := fmt.Sprintf("%s/api/v1/watch", c.BaseURL)
	
	payload, err := json.Marshal(req)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %w", err)
	}
	
	httpReq, err := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}
	
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("x-api-key", c.APIKey)
	
	client := &http.Client{}
	resp, err := client.Do(httpReq)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()
	
	body, _ := io.ReadAll(resp.Body)
	
	// ChangeDetection.io returns 201 Created on success
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return "", fmt.Errorf("changedetection.io API error: %d - %s", resp.StatusCode, string(body))
	}
	
	// Parse the UUID from the response
	var result struct {
		UUID string `json:"uuid"`
	}
	if err := json.Unmarshal(body, &result); err != nil {
		return "", fmt.Errorf("failed to parse response: %w", err)
	}
	
	return result.UUID, nil
}

// DeleteWatch deletes a watch from changedetection.io
func (c *Client) DeleteWatch(uuid string) error {
	url := fmt.Sprintf("%s/api/v1/watch/%s", c.BaseURL, uuid)
	
	httpReq, err := http.NewRequest("DELETE", url, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}
	
	httpReq.Header.Set("x-api-key", c.APIKey)
	
	client := &http.Client{}
	resp, err := client.Do(httpReq)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()
	
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("changedetection.io API error: %d - %s", resp.StatusCode, string(body))
	}
	
	return nil
}
