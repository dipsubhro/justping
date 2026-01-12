import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSelector } from '../utils/selectorGenerator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Pin, Loader2, Globe, Copy, Info } from 'lucide-react';
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

  const navigate = useNavigate();
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

  // Handle pin button click - POST to create monitor
  const handlePinClick = useCallback(async () => {
    if (!loadedUrl) return;

    // Extract page title from loaded page (if available)
    let pageTitle = 'Unnamed Monitor';
    try {
      const iframeDoc = iframeRef.current?.contentDocument;
      if (iframeDoc?.title) {
        pageTitle = iframeDoc.title;
      }
    } catch {
      // Cross-origin - use URL as fallback
      pageTitle = new URL(loadedUrl).hostname;
    }

    // Determine target type based on pinned element
    const targetType = pinnedElement 
      ? `Element - ${pinnedElement.selector}` 
      : 'Full Page Monitor';

    try {
      const response = await fetch('http://localhost:3002/api/monitors/create', {
        method: 'POST',
        credentials: 'include', // Send auth cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteName: pageTitle,
          targetType: targetType,
          url: loadedUrl,
          selector: pinnedElement?.selector || '',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - redirect to monitors page
        setDialogMessage(`Monitor created successfully!\\n\\n"${pageTitle}" is now being monitored.`);
        setDialogType('success');
        setDialogOpen(true);
        
        // Navigate to monitors page after short delay
        setTimeout(() => {
          navigate('/navigate/monitors');
        }, 1500);
      } else if (response.status === 409) {
        // Duplicate monitor
        setDialogMessage(`Monitor already exists!\\n\\nYou already have a monitor for this URL.\\n\\nRedirecting to monitors page...`);
        setDialogType('error');
        setDialogOpen(true);
        
        // Still redirect to show existing monitor
        setTimeout(() => {
          navigate('/navigate/monitors');
        }, 2000);
      } else if (response.status === 401) {
        // Not authenticated
        setDialogMessage(`Please log in first\\n\\nYou need to be logged in to create monitors.`);
        setDialogType('error');
        setDialogOpen(true);
      } else {
        // Other error
        setDialogMessage(`Failed to create monitor\\n\\n${data.error || 'Unknown error'}`);
        setDialogType('error');
        setDialogOpen(true);
      }
    } catch (err) {
      console.error('Error creating monitor:', err);
      setDialogMessage(`Failed to connect to backend\\n\\nMake sure you're logged in and the server is running.`);
      setDialogType('error');
      setDialogOpen(true);
    }
  }, [loadedUrl, pinnedElement]);

  return (
    <div className="flex flex-col h-full w-full p-4 gap-4 box-border">
      {/* Viewport Container */}
      <Card className="flex-1 flex flex-col overflow-hidden border-2 shadow-sm bg-background">
        <CardHeader className="p-3 border-b space-y-0">
          {/* Viewport header with URL input and buttons */}
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full transition-colors ${
              loadedUrl && !isLoading && !error ? 'bg-green-500' : 'bg-none border border-muted-foreground'
            }`} />
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  className="pl-9 h-9"
                  placeholder="Enter URL to inspect (e.g., google.com)..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadUrl}
                disabled={isLoading}
                className="h-9 px-4 min-w-[80px]"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Load'}
              </Button>
              <Button
                size="sm"
                onClick={handlePinClick}
                disabled={!loadedUrl || isLoading}
                className="h-9 px-4 min-w-[80px]"
              >
                <Pin className="h-4 w-4 mr-2" />
                Pin
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 relative overflow-hidden bg-muted/20">
          {!loadedUrl ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 opacity-50" />
              </div>
              <h3 className="text-lg font-medium mb-2">Element Selector</h3>
              <p className="max-w-md text-sm mb-6">
                Enter a URL above to get started. You can browse the page, hover to inspect elements, and click to pin them for monitoring.
              </p>
              <div className="flex items-center gap-4 text-xs bg-background/50 px-4 py-2 rounded-full border">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500/50" /> Hover to highlight</span>
                <span className="w-px h-3 bg-border" />
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500/50" /> Click to pin</span>
              </div>
            </div>
          ) : (
            <>
              {error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
                  <div className="p-6 max-w-sm text-center">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Info className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium text-destructive mb-2">Failed to Load</h3>
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => setError(null)}>
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  className="w-full h-full border-0 bg-white"
                  src="about:blank"
                  onLoad={handleIframeLoad}
                  sandbox="allow-same-origin allow-scripts allow-forms"
                  title="Website Preview"
                />
              )}

              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-[1px] z-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <span className="text-sm font-medium">{loadingStatus || 'Loading...'}</span>
                </div>
              )}

              {/* Hover highlight */}
              {hoverRect && !pinnedElement && (
                <div
                  className="pointer-events-none border-2 border-blue-500 bg-blue-500/10 transition-all duration-75 z-20"
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
                  className="pointer-events-none border-2 border-green-500 bg-green-500/20 z-30"
                  style={{
                    top: pinnedElement.rect.top,
                    left: pinnedElement.rect.left,
                    width: pinnedElement.rect.width,
                    height: pinnedElement.rect.height,
                    position: 'absolute',
                  }}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Selector Panel */}
      {pinnedElement && (
        <Card 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl shadow-lg border-2 border-primary/20 cursor-pointer hover:border-primary transition-colors animate-in slide-in-from-bottom-4 fade-in z-50"
          onClick={copySelector}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  &lt;{pinnedElement.tagName}&gt;
                </span>
                {copied && (
                  <span className="text-xs font-medium text-green-600 flex items-center gap-1 animate-in fade-in slide-in-from-left-2">
                    <Copy className="h-3 w-3" /> Copied!
                  </span>
                )}
              </div>
              <div className="font-mono text-sm truncate text-foreground" title={pinnedElement.selector}>
                {pinnedElement.selector}
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-right shrink-0">
              <div>Click to copy selector</div>
              <div>Click element to unpin</div>
            </div>
          </CardContent>
        </Card>
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
