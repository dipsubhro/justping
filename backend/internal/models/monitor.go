package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Monitor struct {
	ID                  primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	UserID              string             `json:"userId" bson:"userId"`
	WebsiteName         string             `json:"websiteName" bson:"websiteName"`
	TargetType          string             `json:"targetType" bson:"targetType"`
	URL                 string             `json:"url" bson:"url"`
	Selector            string             `json:"selector,omitempty" bson:"selector,omitempty"`
	Status              string             `json:"status" bson:"status"` // active, paused, error
	LastChecked         time.Time          `json:"lastChecked" bson:"lastChecked"`
	Frequency           Frequency          `json:"frequency" bson:"frequency"`
	HasChanged          bool               `json:"hasChanged" bson:"hasChanged"`
	CreatedAt           time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt           time.Time          `json:"updatedAt" bson:"updatedAt"`
	ChangeDetectionUUID string             `json:"changeDetectionUuid,omitempty" bson:"changeDetectionUuid,omitempty"`
	Duration            *Duration          `json:"duration,omitempty" bson:"duration,omitempty"`
	AlertsEnabled       bool               `json:"alertsEnabled" bson:"alertsEnabled"`
	NotificationMethod  string             `json:"notificationMethod,omitempty" bson:"notificationMethod,omitempty"`
	DetectionMode       string             `json:"detectionMode,omitempty" bson:"detectionMode,omitempty"`
}

type Frequency struct {
	Value int    `json:"value" bson:"value"`
	Unit  string `json:"unit" bson:"unit"` // minutes, hours
}

type Duration struct {
	Type    string `json:"type" bson:"type"`         // "forever", "until_date", "first_change"
	EndDate string `json:"endDate,omitempty" bson:"endDate,omitempty"`
}

type CreateMonitorRequest struct {
	WebsiteName        string    `json:"websiteName"`
	TargetType         string    `json:"targetType"`
	URL                string    `json:"url"`
	Selector           string    `json:"selector,omitempty"`
	Frequency          Frequency `json:"frequency,omitempty"`
	Duration           Duration  `json:"duration,omitempty"`
	AlertsEnabled      bool      `json:"alertsEnabled"`
	NotificationMethod string    `json:"notificationMethod,omitempty"`
	DetectionMode      string    `json:"detectionMode,omitempty"`
}
