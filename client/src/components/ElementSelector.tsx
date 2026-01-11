import { useState, useRef, useCallback, useEffect } from 'react';
import { generateSelector } from '../utils/selectorGenerator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import '../App.css';

interface HighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface PinnedElement {
  selector: string;
  rect: HighlightRect;
  tagName: string;
}

// CORS proxy to bypass cross-origin restrictions
const CORS_PROXIES = [
  'https://corsproxy.io/?key=d655d270&url=',
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://thingproxy.freeboard.io/fetch/',
  'https://cors-anywhere.herokuapp.com/',
];



export default function ElementSelector() {
  const [url, setUrl] = useState('');
  const [loadedUrl, setLoadedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [hoverRect, setHoverRect] = useState<HighlightRect | null>(null);
  const [pinnedElement, setPinnedElement] = useState<PinnedElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [proxyContent, setProxyContent] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hoveredElementRef = useRef<Element | null>(null);
  const pinnedSelectorRef = useRef<string | null>(null);

  // Keep ref in sync with state for event handlers
  useEffect(() => {
    pinnedSelectorRef.current = pinnedElement?.selector || null;
  }, [pinnedElement]);

  // Calculate element rect relative to iframe wrapper (for absolute positioning)
  const getElementRect = useCallback((element: Element): HighlightRect | null => {
    try {
      // getBoundingClientRect returns coordinates relative to the iframe's viewport
      // Since we are positioning absolutely inside the iframe wrapper (which matches the iframe viewport),
      // we can use these coordinates directly.
      const elementRect = element.getBoundingClientRect();

      return {
        top: elementRect.top,
        left: elementRect.left,
        width: elementRect.width,
        height: elementRect.height,
      };
    } catch {
      return null;
    }
  }, []);

  // Setup iframe event listeners
  const setupIframeListeners = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const iframeDoc = iframe.contentDocument;
      if (!iframeDoc) {
        setError('Cannot access page content');
        return;
      }

      // Mouse move handler for hover
      const handleMouseMove = (e: MouseEvent) => {
        const target = e.target as Element;
        if (!target || target === hoveredElementRef.current) return;

        // Skip html and body
        const tagName = target.tagName.toLowerCase();
        if (tagName === 'html' || tagName === 'body') {
          setHoverRect(null);
          hoveredElementRef.current = null;
          return;
        }

        hoveredElementRef.current = target;
        const rect = getElementRect(target);
        setHoverRect(rect);
      };

      // Click handler for pinning
      const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const target = e.target as Element;
        if (!target) return;

        // Skip html and body
        const tagName = target.tagName.toLowerCase();
        if (tagName === 'html' || tagName === 'body') return;

        const rect = getElementRect(target);
        if (!rect) return;

        const selector = generateSelector(target);

        // Toggle pin using ref for current state
        if (pinnedSelectorRef.current === selector) {
          setPinnedElement(null);
        } else {
          setPinnedElement({ selector, rect, tagName });
        }

        return false;
      };

      // Mouse leave handler
      const handleMouseLeave = () => {
        setHoverRect(null);
        hoveredElementRef.current = null;
      };

      // Attach event listeners
      iframeDoc.addEventListener('click', handleClick, true);
      iframeDoc.addEventListener('mousemove', handleMouseMove, true);
      iframeDoc.addEventListener('mouseleave', handleMouseLeave);
      iframeDoc.addEventListener('mousedown', (e) => e.preventDefault(), true);

      // Change cursor
      iframeDoc.body.style.cursor = 'crosshair';

      setError(null);
    } catch (err) {
      console.error('Error setting up iframe listeners:', err);
      setError('Cannot access page content');
    }
  }, [getElementRect]);

  // Fetch URL content via CORS proxy
  const fetchViaProxy = useCallback(async (targetUrl: string): Promise<string> => {
    let lastError;

    console.log(`Attempting to fetch: ${targetUrl}`);

    for (const proxy of CORS_PROXIES) {
      try {
        const proxyName = new URL(proxy).hostname;
        const fullUrl = proxy + encodeURIComponent(targetUrl);
        console.log(`Trying proxy: ${proxyName} -> ${fullUrl}`);
        setLoadingStatus(`Trying proxy: ${proxyName}...`);

        const response = await fetch(fullUrl);
        console.log(`Response from ${proxyName}: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        console.log(`Received ${html.length} bytes from ${proxyName}`);

        if (!html || html.length < 100) {
          throw new Error('Empty or invalid response');
        }

        // Rewrite relative URLs to absolute
        const baseUrl = new URL(targetUrl);
        const rewrittenHtml = rewriteUrls(html, baseUrl);

        return rewrittenHtml;
      } catch (err) {
        console.warn(`Proxy ${proxy} failed:`, err);
        lastError = err;
        continue;
      }
    }

    throw lastError || new Error('All proxies failed');
  }, []);

  // Rewrite relative URLs in HTML to absolute URLs
  const rewriteUrls = (html: string, baseUrl: URL): string => {
    // Rewrite src attributes
    let result = html.replace(
      /(<(?:img|script|iframe|video|audio|source|embed)[^>]*\s)src=["'](?!(?:https?:|data:|javascript:|#))([^"']+)["']/gi,
      (match, prefix, path) => {
        try {
          const absoluteUrl = new URL(path, baseUrl.origin).href;
          return `${prefix}src="${absoluteUrl}"`;
        } catch {
          return match;
        }
      }
    );

    // Rewrite href attributes for stylesheets
    result = result.replace(
      /(<link[^>]*\s)href=["'](?!(?:https?:|data:|#))([^"']+)["']/gi,
      (match, prefix, path) => {
        try {
          const absoluteUrl = new URL(path, baseUrl.origin).href;
          return `${prefix}href="${absoluteUrl}"`;
        } catch {
          return match;
        }
      }
    );

    // Rewrite CSS url() references
    result = result.replace(
      /url\(["']?(?!(?:https?:|data:))([^)"']+)["']?\)/gi,
      (match, path) => {
        try {
          const absoluteUrl = new URL(path, baseUrl.origin).href;
          return `url("${absoluteUrl}")`;
        } catch {
          return match;
        }
      }
    );

    // Add base tag if not present
    if (!/<base\s/i.test(result)) {
      result = result.replace(
        /<head([^>]*)>/i,
        `<head$1><base href="${baseUrl.origin}/">`
      );
    }

    return result;
  };

  // Load URL handler
  const handleLoadUrl = useCallback(async () => {
    if (!url.trim()) return;

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    setIsLoading(true);
    setLoadingStatus('Connecting...');
    setPinnedElement(null);
    setHoverRect(null);
    setError(null);
    setProxyContent(null);
    setLoadedUrl(normalizedUrl);

    try {
      const html = await fetchViaProxy(normalizedUrl);
      setProxyContent(html);
      setLoadingStatus('Rendering...');
    } catch (err) {
      console.error('Failed to fetch via proxy:', err);
      setError('Failed to load page. The site may block proxies.');
      setIsLoading(false);
    }
  }, [url, fetchViaProxy]);

  // Write proxy content to iframe
  useEffect(() => {
    if (!proxyContent || !iframeRef.current) return;

    const iframe = iframeRef.current;

    const writeContent = () => {
      try {
        const doc = iframe.contentDocument;
        if (doc) {
          doc.open();
          doc.write(proxyContent);
          doc.close();
          setIsLoading(false);
          setLoadingStatus('');

          // Setup listeners after a brief delay to let content render
          setTimeout(() => {
            setupIframeListeners();
          }, 100);
        }
      } catch (err) {
        console.error('Error writing to iframe:', err);
        setError('Failed to render page content');
        setIsLoading(false);
      }
    };

    // Wait for iframe to be ready
    if (iframe.contentDocument?.readyState === 'complete') {
      writeContent();
    } else {
      iframe.addEventListener('load', writeContent, { once: true });
    }
  }, [proxyContent, setupIframeListeners]);



  // Handle Enter key in input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLoadUrl();
    }
  };

  // Handle iframe load (for non-proxy loads)
  const handleIframeLoad = useCallback(() => {
    if (!proxyContent) {
      // Direct iframe load - will likely hit CORS
      setIsLoading(false);
      setupIframeListeners();
    }
  }, [proxyContent, setupIframeListeners]);

  // Update pinned element rect on scroll/resize
  useEffect(() => {
    if (!pinnedElement) return;

    const updatePinnedRect = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      try {
        const iframeDoc = iframe.contentDocument;
        if (!iframeDoc) return;

        const element = iframeDoc.querySelector(pinnedElement.selector);
        if (element) {
          const rect = getElementRect(element);
          if (rect) {
            setPinnedElement((prev) =>
              prev ? { ...prev, rect } : null
            );
          }
        }
      } catch {
        // Cross-origin
      }
    };

    window.addEventListener('resize', updatePinnedRect);

    // Also listen to iframe scroll
    try {
      const iframeWin = iframeRef.current?.contentWindow;
      if (iframeWin) {
        iframeWin.addEventListener('scroll', updatePinnedRect);
        return () => {
          window.removeEventListener('resize', updatePinnedRect);
          iframeWin.removeEventListener('scroll', updatePinnedRect);
        };
      }
    } catch {
      // Cross-origin
    }

    return () => {
      window.removeEventListener('resize', updatePinnedRect);
    };
  }, [pinnedElement, getElementRect]);

  // Copy selector to clipboard
  const copySelector = useCallback(async () => {
    if (pinnedElement) {
      await navigator.clipboard.writeText(pinnedElement.selector);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [pinnedElement]);

  // Handle pin button click - POST to backend
  const handlePinClick = useCallback(async () => {
    if (!loadedUrl) return;

    try {
      const response = await fetch('http://localhost:3002/api/watch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: loadedUrl }),
      });

      const data = await response.json();

      if (response.ok && data.changedetection_status === 201) {
        // Success - extract UUID from response body
        const uuidMatch = data.changedetection_body.match(/"uuid":\s*"([^"]+)"/);
        const uuid = uuidMatch ? uuidMatch[1] : 'Created successfully';
        setDialogMessage(`Watch created successfully!\n\nUUID: ${uuid}`);
        setDialogType('success');
        setDialogOpen(true);
      } else {
        // Error from backend or changedetection
        setDialogMessage(`Failed to create watch\n\nStatus: ${data.changedetection_status || 'N/A'}\nError: ${data.error || data.changedetection_body || 'Unknown error'}`);
        setDialogType('error');
        setDialogOpen(true);
      }
    } catch (err) {
      console.error('Error creating watch:', err);
      setDialogMessage(`Failed to connect to backend\n\nMake sure the Go server is running on port 3002`);
      setDialogType('error');
      setDialogOpen(true);
    }
  }, [loadedUrl]);

  return (
    <div className="app">
      {/* Viewport Container - centered box layout */}
      <div className="viewport-container">
        <div className="viewport-box">
          {/* Viewport header with URL input and buttons */}
          <div className="viewport-header">
            <div className={`viewport-dot ${loadedUrl && !isLoading && !error ? 'active' : ''}`} />
            <input
              type="text"
              className="viewport-url-input"
              placeholder="Enter URL to inspect (e.g., google.com)..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              className="viewport-btn"
              onClick={handleLoadUrl}
              disabled={isLoading}
            >
              {isLoading ? '...' : 'Load'}
            </button>
            <button
              className="viewport-btn pin"
              onClick={handlePinClick}
              disabled={!loadedUrl || isLoading}
            >
              Pin
            </button>
          </div>

          {!loadedUrl ? (
            <div className="iframe-wrapper">
              <div className="empty-state">
                {/* <div className="empty-state-title">Element Selector</div> */}
                <div className="empty-state-text">
                  Enter a URL above to get started
                  <div className="empty-state-hint">
                    Hover to highlight · Click to pin · Generate CSS selectors
                  </div>
                </div>
              </div>
            </div>
          ) : (

            <div className="iframe-wrapper">
              {error ? (
                <div className="error-state">
                  <div className="error-state-title">Load Failed</div>
                  <div className="error-state-text">
                    {error}
                  </div>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  className="site-iframe"
                  src="about:blank"
                  onLoad={handleIframeLoad}
                  sandbox="allow-same-origin allow-scripts allow-forms"
                  title="Website Preview"
                />
              )}

              {isLoading && (
                <div className="loading-indicator">
                  {loadingStatus || 'Loading...'}
                </div>
              )}

              {/* Hover highlight */}
              {hoverRect && !pinnedElement && (
                <div
                  className="highlight-box"
                  style={{
                    top: hoverRect.top,
                    left: hoverRect.left,
                    width: hoverRect.width,
                    height: hoverRect.height,
                    position: 'absolute',
                  }}
                />
              )}

              {/* Pinned highlight */}
              {pinnedElement && (
                <div
                  className="highlight-box pinned"
                  style={{
                    top: pinnedElement.rect.top,
                    left: pinnedElement.rect.left,
                    width: pinnedElement.rect.width,
                    height: pinnedElement.rect.height,
                    position: 'absolute',
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selector Panel */}
      {pinnedElement && (
        <div className="selector-panel" onClick={copySelector}>
          <div className="selector-header">
            <span className="selector-tag">&lt;{pinnedElement.tagName}&gt;</span>
            {copied && <span className="copied-badge">Copied</span>}
          </div>
          <div className="selector-label">CSS Selector</div>
          <div className="selector-value">{pinnedElement.selector}</div>
          <div className="selector-hint">Click panel to copy · Click element to unpin</div>
        </div>
      )}

      {/* Success/Error Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={dialogType === 'success' ? 'border-green-500' : 'border-red-500'}>
          <DialogHeader>
            <DialogTitle className={dialogType === 'success' ? 'text-green-600' : 'text-red-600'}>
              {dialogType === 'success' ? '✓ Success' : '✗ Error'}
            </DialogTitle>
            <DialogDescription className="whitespace-pre-line text-left">
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
