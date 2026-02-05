package renderer

import (
	"log"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
)

var globalBrowser *rod.Browser

// InitBrowser launches a shared headless Chromium instance.
// Call once at startup; defer CloseBrowser for cleanup.
func InitBrowser() {
	u := launcher.New().
		Headless(true).
		Set("no-sandbox", "").
		Set("disable-setuid-sandbox", "").
		Set("disable-dev-shm-usage", "").
		MustLaunch()

	globalBrowser = rod.New().ControlURL(u).MustConnect()
	log.Println("[renderer] Headless browser started")
}

// GetBrowser returns the shared browser instance.
func GetBrowser() *rod.Browser {
	return globalBrowser
}

// CloseBrowser shuts the browser down gracefully.
func CloseBrowser() {
	if globalBrowser != nil {
		if err := globalBrowser.Close(); err != nil {
			log.Printf("[renderer] Error closing browser: %v", err)
		}
		log.Println("[renderer] Headless browser closed")
	}
}
