package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Alert represents a notification created from a changedetection.io webhook
type Alert struct {
	ID         primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	UserID     string             `json:"userId" bson:"userId"`
	MonitorID  primitive.ObjectID `json:"monitorId" bson:"monitorId"`
	Checked    bool               `json:"checked" bson:"checked"`
	ReceivedAt time.Time          `json:"receivedAt" bson:"receivedAt"`
	Payload    bson.Raw           `json:"payload" bson:"payload"` // Immutable webhook data
}

// AlertResponse is the JSON response format for alerts including parsed payload fields
type AlertResponse struct {
	ID           primitive.ObjectID `json:"_id"`
	UserID       string             `json:"userId"`
	MonitorID    primitive.ObjectID `json:"monitorId"`
	MonitorName  string             `json:"monitorName,omitempty"`
	Checked      bool               `json:"checked"`
	ReceivedAt   time.Time          `json:"receivedAt"`
	Payload      map[string]any     `json:"payload"`
}
