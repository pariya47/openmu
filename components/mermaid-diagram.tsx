"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { cn } from '@/lib/utils';
import { AlertTriangle, RefreshCw, X, Maximize2 } from 'lucide-react';

export interface MermaidDiagramProps {
  diagram: string;
  className?: string;
  onError?: (error: Error) => void;
  config?: any;
}

export function MermaidDiagram({ 
  diagram, 
  className, 
  onError,
  config = {}
}: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [lastDiagramContent, setLastDiagramContent] = useState<string>("");
  
  // Fullscreen zoom and pan state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [isTextSelecting, setIsTextSelecting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldShowModal, setShouldShowModal] = useState(false);

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      suppressErrorRendering: true,
      ...config
    });
  }, [config]);

  // Render diagram
  const renderDiagram = useCallback(async (targetContainer?: HTMLDivElement) => {
    const container = targetContainer || containerRef.current;
    if (!container || !diagram) return;

    setIsLoading(true);
    setError(null);

    try {
      // Clear previous content
      container.innerHTML = '';
      
      // Generate unique ID for this diagram
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      
      // Render the diagram
      const { svg } = await mermaid.render(id, diagram);
      
      // Insert the SVG
      container.innerHTML = svg;
      
      // Make SVG responsive for normal view
      const svgElement = container.querySelector('svg');
      if (svgElement && !targetContainer) {
        // For normal view - remove max height restrictions and ensure full visibility
        svgElement.style.width = '100%';
        svgElement.style.height = 'auto';
        svgElement.style.display = 'block';
        svgElement.style.margin = '0 auto';
      } else if (svgElement && targetContainer) {
        // For fullscreen view - prepare for zoom/pan and enable text selection
        svgElement.style.width = '100%';
        svgElement.style.height = '100%';
        svgElement.style.display = 'block';
        svgElement.style.transformOrigin = 'center center';
        
        // Enable text selection on text elements
        const textElements = svgElement.querySelectorAll('text');
        textElements.forEach(textEl => {
          textEl.style.userSelect = 'text';
          textEl.style.cursor = 'text';
          textEl.style.pointerEvents = 'auto';
        });
      }
      
      // Success! Clear error state and update last diagram content
      setError(null);
      setLastDiagramContent(diagram);
      setIsLoading(false);
    } catch (err) {
      const error = err as Error;
      
      // Create user-friendly error message
      let userFriendlyMessage = "Unable to render diagram";
      
      if (error.message.toLowerCase().includes("syntax")) {
        userFriendlyMessage = "Invalid diagram syntax";
      } else if (error.message.toLowerCase().includes("parse")) {
        userFriendlyMessage = "Diagram format error";
      } else if (error.message.toLowerCase().includes("lexical")) {
        userFriendlyMessage = "Invalid diagram structure";
      } else if (error.message.toLowerCase().includes("unexpected")) {
        userFriendlyMessage = "Unexpected diagram content";
      } else if (error.message.toLowerCase().includes("expecting") && error.message.toLowerCase().includes("got")) {
        userFriendlyMessage = "Invalid diagram syntax - missing or incorrect symbols";
      } else if (error.message.toLowerCase().includes("pipe")) {
        userFriendlyMessage = "Invalid character usage in diagram";
      } else if (error.message.toLowerCase().includes("diamond_stop") || error.message.toLowerCase().includes("tagend")) {
        userFriendlyMessage = "Missing closing brackets or incomplete syntax";
      }
      
      setError(JSON.stringify({
        userMessage: userFriendlyMessage,
        technicalMessage: error.message,
        timestamp: new Date().toISOString()
      }));
      setLastDiagramContent(diagram); // Update this even on error to track content changes
      setIsLoading(false);
      
      // Call onError callback
      onError?.(error);
    }
  }, [diagram, onError]);

  // Re-render when diagram changes
  useEffect(() => {
    // If diagram content has changed, clear any existing error and re-render
    if (diagram !== lastDiagramContent) {
      setLastDiagramContent(diagram);
      setError(null); // Clear error when diagram content changes
      setShowErrorDetails(false);
      renderDiagram();
    }
    // Also render if no error and diagram exists but container is empty
    else if (!error && diagram && containerRef.current && !containerRef.current.innerHTML) {
      renderDiagram();
    }
  }, [diagram, lastDiagramContent, error, renderDiagram]);

  // Initial render
  useEffect(() => {
    if (diagram && !lastDiagramContent) {
      renderDiagram();
    }
  }, [diagram, lastDiagramContent, renderDiagram]);

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      // Entering fullscreen
      setShouldShowModal(true);
      setIsAnimating(true); // Start with animation state
      setScale(1);
      setPosition({ x: 0, y: 0 });
      
      // Set fullscreen state and trigger animation
      setTimeout(() => {
        setIsFullscreen(true);
        setIsAnimating(false);
        
        // Render diagram after animation starts
        setTimeout(() => {
          if (fullscreenContainerRef.current) {
            renderDiagram(fullscreenContainerRef.current);
          }
        }, 50);
      }, 16); // Single frame delay
    } else {
      // Exiting fullscreen - start exit animation
      setIsAnimating(true);
      setTimeout(() => {
        setIsFullscreen(false);
        setShouldShowModal(false);
        setIsAnimating(false);
      }, 250);
    }
  }, [isFullscreen, renderDiagram]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  // Handle mouse events for drag and zoom in fullscreen
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isFullscreen) return;
    
    // Check if user is trying to select text
    const target = e.target as HTMLElement;
    if (target.tagName === 'text' || target.closest('text')) {
      setIsTextSelecting(true);
      return;
    }
    
    setIsDragging(true);
    setLastMousePosition({ x: e.clientX, y: e.clientY });
  }, [isFullscreen]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !isFullscreen || isTextSelecting) return;
    
    const deltaX = e.clientX - lastMousePosition.x;
    const deltaY = e.clientY - lastMousePosition.y;
    
    setPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setLastMousePosition({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastMousePosition, isFullscreen, isTextSelecting]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsTextSelecting(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!isFullscreen) return;
    e.preventDefault();
    
    const delta = e.deltaY * -0.001;
    const newScale = Math.max(0.1, Math.min(5, scale + delta));
    setScale(newScale);
  }, [isFullscreen, scale]);

  // Reset zoom and pan when leaving fullscreen
  useEffect(() => {
    if (!isFullscreen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsDragging(false);
      setIsTextSelecting(false);
    }
  }, [isFullscreen]);

  // Handle modal cleanup
  useEffect(() => {
    if (!isFullscreen && !isAnimating) {
      setShouldShowModal(false);
    }
  }, [isFullscreen, isAnimating]);

  if (error) {
    let errorData;
    try {
      errorData = error ? JSON.parse(error) : null;
    } catch {
      errorData = { 
        userMessage: "Unable to render diagram", 
        technicalMessage: error,
        timestamp: new Date().toISOString()
      };
    }

    return (
      <div className={cn(
        "relative border rounded-lg border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800",
        className
      )}>
        {/* Content */}
        <div className="p-6">
          {/* Error state */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                {errorData?.userMessage || "Unable to render diagram"}
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                There was an issue rendering this diagram. The diagram will automatically retry when you fix the syntax.
              </p>
              
              {/* Action button for details */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setShowErrorDetails(!showErrorDetails)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors"
                >
                  {showErrorDetails ? 'Hide' : 'Show'} Details
                </button>
              </div>

              {/* Technical details (collapsible) */}
              {showErrorDetails && errorData && (
                <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800">
                  <h4 className="text-xs font-medium text-red-800 dark:text-red-200 mb-2">
                    Technical Details:
                  </h4>
                  <code className="text-xs text-red-700 dark:text-red-300 font-mono break-all">
                    {errorData.technicalMessage}
                  </code>
                  <div className="text-xs text-red-600 dark:text-red-400 mt-2">
                    Time: {new Date(errorData.timestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Normal view */}
      <div 
        className={cn(
          "relative group cursor-pointer transition-all duration-200 hover:shadow-lg",
          className
        )}
        onClick={toggleFullscreen}
        role="button"
        tabIndex={0}
        aria-label="Click to view diagram in fullscreen"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFullscreen();
          }
        }}
      >
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        
        <div 
          ref={containerRef}
          className={cn(
            "mermaid-container transition-opacity duration-200 w-full overflow-visible flex items-center justify-center",
            isLoading ? "opacity-0" : "opacity-100"
          )}
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <Maximize2 className="h-5 w-5 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Fullscreen modal */}
      {shouldShowModal && (
        <div 
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ease-out",
            !isFullscreen || isAnimating
              ? "bg-black/0 backdrop-blur-none" 
              : "bg-black/30 backdrop-blur-sm"
          )}
          onClick={toggleFullscreen}
        >
          <div 
            className={cn(
              "relative bg-white rounded-lg shadow-2xl w-full h-full max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col transition-all duration-200 ease-out",
              !isFullscreen || isAnimating
                ? "opacity-0 scale-90" 
                : "opacity-100 scale-100"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
              aria-label="Close fullscreen view"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
            
            {/* Fullscreen diagram with drag and zoom */}
            <div 
              className={cn(
                "flex-1 overflow-hidden flex items-center justify-center relative transition-all duration-200",
                isTextSelecting ? "cursor-text" : isDragging ? "cursor-grabbing" : "cursor-grab"
              )}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              <div 
                ref={fullscreenContainerRef}
                className="mermaid-fullscreen w-full h-full flex items-center justify-center"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
              />
            </div>
            
            {/* Zoom controls */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Zoom: {Math.round(scale * 100)}%</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setScale(Math.max(0.1, scale - 0.1));
                  }}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                >
                  -
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                  }}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                >
                  Reset
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setScale(Math.min(5, scale + 0.1));
                  }}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}