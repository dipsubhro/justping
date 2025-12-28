import { useState, useRef, useCallback, useEffect } from 'react';
import { generateSelector } from '../utils/selectorGenerator';
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

// Demo HTML content for testing without CORS issues
const DEMO_HTML = `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: #1a1a1a; color: #fff; padding: 40px; min-height: 100vh; }
    .container { max-width: 800px; margin: 0 auto; }
    h1 { font-size: 48px; margin-bottom: 24px; cursor: default; }
    p { font-size: 18px; line-height: 1.6; margin-bottom: 16px; color: #aaa; }
    .card { background: #252525; border: 1px solid #333; padding: 24px; margin-top: 32px; }
    .card-title { font-size: 24px; margin-bottom: 12px; }
    .card-text { color: #888; }
    .btn { display: inline-block; background: #FFF44F; color: #000; padding: 12px 24px; margin-top: 16px; text-decoration: none; font-weight: 600; cursor: pointer; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 32px; }
    .grid-item { background: #2a2a2a; padding: 32px; text-align: center; border: 1px solid #333; }
    .nav { display: flex; gap: 24px; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #333; }
    .nav a { color: #888; text-decoration: none; cursor: pointer; }
    .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #333; color: #555; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <nav class="nav">
      <a href="#">Home</a>
      <a href="#">Products</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
    </nav>
    <h1>Welcome to Demo Page</h1>
    <p>This is a demo page for testing the element selector. Hover over any element to highlight it, then click to pin and generate a CSS selector.</p>
    <p>The selector will appear in the panel at the bottom left of the screen.</p>
    <div class="card">
      <h2 class="card-title">Featured Content</h2>
      <p class="card-text">This is a sample card component with some nested elements that you can select.</p>
      <a href="#" class="btn">Learn More</a>
    </div>
    <div class="grid">
      <div class="grid-item" id="item-1">Item 1</div>
      <div class="grid-item" id="item-2">Item 2</div>
      <div class="grid-item" id="item-3">Item 3</div>
    </div>
    <footer class="footer">
      &copy; 2026 Demo Company. All rights reserved.
    </footer>
  </div>
</body>
</html>
`;

export default function Pinning() {
  const [url, setUrl] = useState('');
  const [loadedUrl, setLoadedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [hoverRect, setHoverRect] = useState<HighlightRect | null>(null);
  const [pinnedElement, setPinnedElement] = useState<PinnedElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [proxyContent, setProxyContent] = useState<string | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hoveredElementRef = useRef<Element | null>(null);
  const pinnedSelectorRef = useRef<string | null>(null);

  // Keep ref in sync with state for event handlers
  useEffect(() => {
    pinnedSelectorRef.current = pinnedElement?.selector || null;
  }, [pinnedElement]);

  // Calculate element rect relative to viewport
  const getElementRect = useCallback((element: Element): HighlightRect | null => {
    const iframe = iframeRef.current;
    if (!iframe) return null;

    try {
      const iframeRect = iframe.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      return {
        top: iframeRect.top + elementRect.top,
        left: iframeRect.left + elementRect.left,
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
    setIsDemo(false);
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

  // Load demo content
  const handleLoadDemo = useCallback(() => {
    setIsLoading(true);
    setLoadingStatus('Loading demo...');
    setPinnedElement(null);
    setHoverRect(null);
    setError(null);
    setIsDemo(true);
    setProxyContent(null);
    setLoadedUrl('about:blank');

    // Write demo content after brief delay
    setTimeout(() => {
      const iframe = iframeRef.current;
      if (iframe) {
        try {
          const doc = iframe.contentDocument;
          if (doc) {
            doc.open();
            doc.write(DEMO_HTML);
            doc.close();
            setIsLoading(false);
            setLoadingStatus('');
            setupIframeListeners();
          }
        } catch {
          setError('Failed to load demo');
          setIsLoading(false);
        }
      }
    }, 100);
  }, [setupIframeListeners]);

  // Handle Enter key in input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLoadUrl();
    }
  };

  // Handle iframe load (for non-proxy loads)
  const handleIframeLoad = useCallback(() => {
    if (!proxyContent && !isDemo) {
      // Direct iframe load - will likely hit CORS
      setIsLoading(false);
      setupIframeListeners();
    }
  }, [proxyContent, isDemo, setupIframeListeners]);

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

  return (
    <div className="app">
      {/* URL Input Bar */}
      <div className="url-bar">
        <input
          type="text"
          className="url-input"
          placeholder="Enter URL to inspect (e.g., google.com)..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button
          className="load-btn"
          onClick={handleLoadUrl}
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Load'}
        </button>
        <button
          className="load-btn demo-btn"
          onClick={handleLoadDemo}
          disabled={isLoading}
        >
          Demo
        </button>
      </div>

      {/* Viewport Container - centered box layout */}
      <div className="viewport-container">
        {!loadedUrl ? (
          <div className="viewport-box">
            <div className="empty-state">
              <div className="empty-state-title">Element Selector</div>
              <div className="empty-state-text">
                Enter a URL above or click DEMO to test
              </div>
              <div className="empty-state-hint">
                Hover to highlight · Click to pin · Generate CSS selectors
              </div>
            </div>
          </div>
        ) : (
          <div className="viewport-box">
            {/* Viewport header with URL */}
            <div className="viewport-header">
              <div className={`viewport-dot ${!isLoading && !error ? 'active' : ''}`} />
              <span className="viewport-url">
                {isDemo ? 'Demo Page' : loadedUrl}
              </span>
            </div>

            <div className="iframe-wrapper">
              {error ? (
                <div className="error-state">
                  <div className="error-state-title">Load Failed</div>
                  <div className="error-state-text">
                    {error}
                    <br />
                    <br />
                    Try the DEMO button to test element selection.
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
                    position: 'fixed',
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
                    position: 'fixed',
                  }}
                />
              )}
            </div>
          </div>
        )}
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
    </div>
  );
}
