"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';
import mermaid from 'mermaid';
import { cn } from '@/lib/utils';
import { AlertTriangle, RefreshCw, X, Maximize2 } from 'lucide-react';

// Consolidated state interface for better performance
interface DiagramState {
  isLoading: boolean;
  error: string | null;
  showErrorDetails: boolean;
  lastDiagramContent: string;
  scale: number;
  position: { x: number; y: number };
  isDragging: boolean;
  lastMousePosition: { x: number; y: number };
  isTextSelecting: boolean;
}

// Consolidated fullscreen state
interface FullscreenState {
  isFullscreen: boolean;
  isAnimating: boolean;
  shouldShowModal: boolean;
}

export interface MermaidDiagramProps {
  diagram: string;
  className?: string;
  onError?: (error: Error) => void;
  config?: any;
}

const MermaidDiagramComponent = ({ 
  diagram, 
  className, 
  onError,
  config = {}
}: MermaidDiagramProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement | null>(null);
  const mermaidInitializedRef = useRef<boolean>(false);
  const currentDiagramIdRef = useRef<string | null>(null);

  // Consolidated state for better performance
  const [diagramState, setDiagramState] = useState<DiagramState>({
    isLoading: true,
    error: null,
    showErrorDetails: false,
    lastDiagramContent: "",
    scale: 1,
    position: { x: 0, y: 0 },
    isDragging: false,
    lastMousePosition: { x: 0, y: 0 },
    isTextSelecting: false,
  });

  const [fullscreenState, setFullscreenState] = useState<FullscreenState>({
    isFullscreen: false,
    isAnimating: false,
    shouldShowModal: false,
  });

  // Refs for smooth mouse interactions without re-renders
  const isDraggingRef = useRef(false);
  const isTextSelectingRef = useRef(false);
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const animationFrameRef = useRef<number | null>(null);
  const diagramTransformRef = useRef<HTMLDivElement | null>(null);

  // Memoize mermaid config to prevent unnecessary re-initializations
  const mermaidConfig = useMemo(() => ({
    startOnLoad: true,
    theme: 'default',
    securityLevel: 'loose',
    suppressErrorRendering: true,
    ...config
  }), [config]);

  // Initialize Mermaid only once
  useEffect(() => {
    if (!mermaidInitializedRef.current) {
      mermaid.initialize(mermaidConfig);
      mermaidInitializedRef.current = true;
    }
  }, [mermaidConfig]);

  // Optimized transform update function for smooth mouse interactions
  const updateTransform = useCallback(() => {
    if (diagramTransformRef.current) {
      const { x, y } = positionRef.current;
      const scale = scaleRef.current;
      diagramTransformRef.current.style.transform = 
        `translate(${x}px, ${y}px) scale(${scale})`;
    }
  }, []);

  // Callback ref for fullscreen container
  const setFullscreenContainerRef = useCallback((el: HTMLDivElement | null) => {
    fullscreenContainerRef.current = el;
    diagramTransformRef.current = el;
  }, []);

  // Throttled state sync for position and scale
  const syncStateWithRefs = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      setDiagramState(prev => ({
        ...prev,
        position: { ...positionRef.current },
        scale: scaleRef.current,
        isDragging: isDraggingRef.current,
        isTextSelecting: isTextSelectingRef.current,
        lastMousePosition: { ...lastMousePositionRef.current }
      }));
    });
  }, []);

  // Optimized render diagram function with better error handling and cleanup
  const renderDiagram = useCallback(async (targetContainer?: HTMLDivElement) => {
    const container = targetContainer || containerRef.current;
    if (!container || !diagram) return;

    // Cleanup previous diagram if exists
    if (currentDiagramIdRef.current) {
      try {
        // Remove any existing SVG content
        container.innerHTML = '';
      } catch (err) {
        console.warn('Error cleaning up previous diagram:', err);
      }
    }

    setDiagramState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Generate unique ID for this diagram
      const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      currentDiagramIdRef.current = id;
      
      // Render the diagram
      const { svg } = await mermaid.render(id, diagram);
      
      // Check if this is still the current diagram (avoid race conditions)
      if (currentDiagramIdRef.current !== id) return;
      
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
      
      // Success! Update state
      setDiagramState(prev => ({
        ...prev,
        error: null,
        lastDiagramContent: diagram,
        isLoading: false
      }));
    } catch (err) {
      const error = err as Error;
      
      // Check if this is still the current diagram
      if (currentDiagramIdRef.current === null) return;
      
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
      
      setDiagramState(prev => ({
        ...prev,
        error: JSON.stringify({
          userMessage: userFriendlyMessage,
          technicalMessage: error.message,
          timestamp: new Date().toISOString()
        }),
        lastDiagramContent: diagram,
        isLoading: false
      }));
      
      // Call onError callback
      onError?.(error);
    }
  }, [diagram, onError]);

  // Optimized effect for diagram changes with debouncing
  useEffect(() => {
    // If diagram content has changed, clear any existing error and re-render
    if (diagram !== diagramState.lastDiagramContent) {
      setDiagramState(prev => ({
        ...prev,
        lastDiagramContent: diagram,
        error: null,
        showErrorDetails: false
      }));
      renderDiagram();
    }
    // Also render if no error and diagram exists but container is empty
    else if (!diagramState.error && diagram && containerRef.current && !containerRef.current.innerHTML) {
      renderDiagram();
    }
  }, [diagram, diagramState.lastDiagramContent, diagramState.error, renderDiagram]);

  // Initial render effect
  useEffect(() => {
    if (diagram && !diagramState.lastDiagramContent) {
      renderDiagram();
    }
  }, [diagram, diagramState.lastDiagramContent, renderDiagram]);

  // Optimized fullscreen toggle with better state management
  const toggleFullscreen = useCallback(() => {
    if (!fullscreenState.isFullscreen) {
      // Entering fullscreen
      setFullscreenState(prev => ({
        ...prev,
        shouldShowModal: true,
        isAnimating: true
      }));
      
      // Reset zoom and position refs
      scaleRef.current = 1;
      positionRef.current = { x: 0, y: 0 };
      setDiagramState(prev => ({
        ...prev,
        scale: 1,
        position: { x: 0, y: 0 }
      }));
      
      // Set fullscreen state and trigger animation
      setTimeout(() => {
        setFullscreenState(prev => ({
          ...prev,
          isFullscreen: true,
          isAnimating: false
        }));
        
        // Render diagram after animation starts
        setTimeout(() => {
          if (fullscreenContainerRef.current) {
            renderDiagram(fullscreenContainerRef.current);
          }
        }, 50);
      }, 16); // Single frame delay
    } else {
      // Exiting fullscreen - start exit animation
      setFullscreenState(prev => ({
        ...prev,
        isAnimating: true
      }));
      setTimeout(() => {
        setFullscreenState(prev => ({
          ...prev,
          isFullscreen: false,
          shouldShowModal: false,
          isAnimating: false
        }));
      }, 250);
    }
  }, [fullscreenState.isFullscreen, renderDiagram]);

  // Optimized escape key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullscreenState.isFullscreen) {
        setFullscreenState(prev => ({ ...prev, isFullscreen: false }));
      }
    };

    if (fullscreenState.isFullscreen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [fullscreenState.isFullscreen]);

  // Optimized mouse event handlers with refs for smooth performance
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!fullscreenState.isFullscreen) return;
    
    // Check if user is trying to select text
    const target = e.target as HTMLElement;
    if (target.tagName === 'text' || target.closest('text')) {
      isTextSelectingRef.current = true;
      syncStateWithRefs();
      return;
    }
    
    isDraggingRef.current = true;
    lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
    
    // Disable transitions during drag for smoother performance
    if (diagramTransformRef.current) {
      diagramTransformRef.current.style.transition = 'none';
    }
    
    // Sync state only when needed
    syncStateWithRefs();
    
    // Prevent default to avoid text selection
    e.preventDefault();
  }, [fullscreenState.isFullscreen, syncStateWithRefs]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // This is just for local moves, global moves are handled by document listeners
    e.preventDefault();
  }, []);

  const handleMouseUp = useCallback(() => {
    // This is handled by global mouse up, but kept for completeness
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      isTextSelectingRef.current = false;
      syncStateWithRefs();
      
      // Re-enable transitions
      if (diagramTransformRef.current) {
        diagramTransformRef.current.style.transition = 'transform 0.1s ease-out';
      }
    }
  }, [syncStateWithRefs]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!fullscreenState.isFullscreen) return;
    e.preventDefault();
    
    const delta = e.deltaY * -0.001;
    const newScale = Math.max(0.1, Math.min(5, scaleRef.current + delta));
    
    // Update ref immediately for smooth zooming
    scaleRef.current = newScale;
    updateTransform();
    
    // Throttle state updates for performance
    syncStateWithRefs();
  }, [fullscreenState.isFullscreen, updateTransform, syncStateWithRefs]);

  // Reset zoom and pan when leaving fullscreen
  useEffect(() => {
    if (!fullscreenState.isFullscreen) {
      // Reset refs
      scaleRef.current = 1;
      positionRef.current = { x: 0, y: 0 };
      isDraggingRef.current = false;
      isTextSelectingRef.current = false;
      
      // Update state
      setDiagramState(prev => ({
        ...prev,
        scale: 1,
        position: { x: 0, y: 0 },
        isDragging: false,
        isTextSelecting: false
      }));
    }
  }, [fullscreenState.isFullscreen]);

  // Add global mouse event listeners for smoother dragging
  useEffect(() => {
    if (!fullscreenState.isFullscreen) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || isTextSelectingRef.current) return;
      
      const deltaX = e.clientX - lastMousePositionRef.current.x;
      const deltaY = e.clientY - lastMousePositionRef.current.y;
      
      // Update refs directly for immediate visual feedback
      positionRef.current = {
        x: positionRef.current.x + deltaX,
        y: positionRef.current.y + deltaY
      };
      lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
      
      // Apply transform immediately for smooth dragging
      updateTransform();
      
      // Prevent default to avoid any browser interference
      e.preventDefault();
    };

    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        isTextSelectingRef.current = false;
        syncStateWithRefs();
        
        // Re-enable transitions
        if (diagramTransformRef.current) {
          diagramTransformRef.current.style.transition = 'transform 0.1s ease-out';
        }
      }
    };

    // Use passive: false for mousemove to allow preventDefault
    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    // Disable text selection during drag
    document.addEventListener('selectstart', (e) => {
      if (isDraggingRef.current) e.preventDefault();
    });

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('selectstart', (e) => {
        if (isDraggingRef.current) e.preventDefault();
      });
    };
  }, [fullscreenState.isFullscreen, updateTransform, syncStateWithRefs]);

  // Handle wheel events for zooming in fullscreen with non-passive listener
  useEffect(() => {
    const fullscreenContainer = fullscreenContainerRef.current?.parentElement;
    if (!fullscreenContainer || !fullscreenState.isFullscreen) return;

    // Add non-passive wheel event listener to prevent default scrolling
    fullscreenContainer.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      fullscreenContainer.removeEventListener('wheel', handleWheel);
    };
  }, [fullscreenState.isFullscreen, handleWheel]);

  // Handle modal cleanup
  useEffect(() => {
    if (!fullscreenState.isFullscreen && !fullscreenState.isAnimating) {
      setFullscreenState(prev => ({ ...prev, shouldShowModal: false }));
    }
  }, [fullscreenState.isFullscreen, fullscreenState.isAnimating]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (diagramState.error) {
    let errorData;
    try {
      errorData = diagramState.error ? JSON.parse(diagramState.error) : null;
    } catch {
      errorData = { 
        userMessage: "Unable to render diagram", 
        technicalMessage: diagramState.error,
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
                  onClick={() => setDiagramState(prev => ({ 
                    ...prev, 
                    showErrorDetails: !prev.showErrorDetails 
                  }))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors"
                >
                  {diagramState.showErrorDetails ? 'Hide' : 'Show'} Details
                </button>
              </div>

              {/* Technical details (collapsible) */}
              {diagramState.showErrorDetails && errorData && (
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
        {diagramState.isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        
        <div 
          ref={containerRef}
          className={cn(
            "mermaid-container transition-opacity duration-200 w-full overflow-visible flex items-center justify-center",
            diagramState.isLoading ? "opacity-0" : "opacity-100"
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
      {fullscreenState.shouldShowModal && (
        <div 
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ease-out",
            !fullscreenState.isFullscreen || fullscreenState.isAnimating
              ? "bg-black/0 backdrop-blur-none" 
              : "bg-black/30 backdrop-blur-sm"
          )}
          onClick={toggleFullscreen}
        >
          <div 
            className={cn(
              "relative bg-white rounded-lg shadow-2xl w-full h-full max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col transition-all duration-200 ease-out",
              !fullscreenState.isFullscreen || fullscreenState.isAnimating
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
                diagramState.isTextSelecting ? "cursor-text" : diagramState.isDragging ? "cursor-grabbing" : "cursor-grab"
              )}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
            >
              <div 
                ref={setFullscreenContainerRef}
                className="mermaid-fullscreen w-full h-full flex items-center justify-center"
                style={{
                  transform: `translate(${diagramState.position.x}px, ${diagramState.position.y}px) scale(${diagramState.scale})`,
                  transformOrigin: 'center center',
                  transition: diagramState.isDragging ? 'none' : 'transform 0.1s ease-out',
                  willChange: 'transform'
                }}
              />
            </div>
            
            {/* Zoom controls */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Zoom: {Math.round(diagramState.scale * 100)}%</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newScale = Math.max(0.1, scaleRef.current - 0.1);
                    scaleRef.current = newScale;
                    updateTransform();
                    syncStateWithRefs();
                  }}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                >
                  -
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    scaleRef.current = 1;
                    positionRef.current = { x: 0, y: 0 };
                    updateTransform();
                    syncStateWithRefs();
                  }}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
                >
                  Reset
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newScale = Math.min(5, scaleRef.current + 0.1);
                    scaleRef.current = newScale;
                    updateTransform();
                    syncStateWithRefs();
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
};

// Memoize component for better performance
export const MermaidDiagram = memo(MermaidDiagramComponent);