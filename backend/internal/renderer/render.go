package renderer

import (
	"context"
	"fmt"
	"regexp"
	"time"

	"github.com/go-rod/rod/lib/proto"
)

const renderTimeout = 15 * time.Second

// compiled sanitization patterns (once at package init)
var (
	// Remove <script>...</script> blocks (multiline, non-greedy)
	reScriptBlock = regexp.MustCompile(`(?si)<script[\s\S]*?</script>`)
	// Remove any remaining stray <script> open tags
	reScriptTag = regexp.MustCompile(`(?i)<script[^>]*>`)
	// Remove inline event handlers: on*="..." or on*='...'
	reEventHandlers = regexp.MustCompile(`(?i)\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)`)
	// Match <form opening tags to inject onsubmit guard
	reFormOpen = regexp.MustCompile(`(?i)<form(\s[^>]*)?>`)
)

// RenderPage navigates to targetURL in a new browser page, waits for full JS
// execution, sanitizes the resulting HTML, and returns it.
func RenderPage(targetURL string) (string, error) {
	browser := GetBrowser()
	if browser == nil {
		return "", fmt.Errorf("browser not initialised")
	}

	ctx, cancel := context.WithTimeout(context.Background(), renderTimeout)
	defer cancel()

	page, err := browser.Page(proto.TargetCreateTarget{URL: "about:blank"})
	if err != nil {
		return "", fmt.Errorf("create page: %w", err)
	}
	defer page.Close()

	// Attach the context so the whole sequence is bounded by renderTimeout
	page = page.Context(ctx)

	if err := page.Navigate(targetURL); err != nil {
		return "", fmt.Errorf("navigate: %w", err)
	}

	// Wait for network idle + JS execution
	if err := page.WaitLoad(); err != nil {
		return "", fmt.Errorf("wait load: %w", err)
	}
	// WaitIdle: non-fatal — some SPAs never fully idle
	_ = page.WaitIdle(500 * time.Millisecond)

	html, err := page.HTML()
	if err != nil {
		return "", fmt.Errorf("get html: %w", err)
	}

	return sanitize(html), nil
}

// sanitize removes scripts, event handlers, and disables form submissions.
func sanitize(html string) string {
	// 1. Strip <script>...</script> blocks first
	html = reScriptBlock.ReplaceAllString(html, "")
	// 2. Strip any remaining stray <script> open tags
	html = reScriptTag.ReplaceAllString(html, "<!-- script removed -->")
	// 3. Strip inline event handlers
	html = reEventHandlers.ReplaceAllString(html, "")
	// 4. Disable form submissions
	html = reFormOpen.ReplaceAllStringFunc(html, func(match string) string {
		if match == "<form>" || match == "<FORM>" {
			return `<form onsubmit="return false;">`
		}
		// <form ...attrs...>  →  strip trailing > and append guard
		return match[:len(match)-1] + ` onsubmit="return false;">`
	})
	return html
}
