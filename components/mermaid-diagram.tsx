"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';
import mermaid from 'mermaid';
import { cn } from '@/lib/utils';
import { AlertTriangle, X, Maximize2 } from 'lucide-react';

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
      
      // Make SVG responsive
      const svgElement = container.querySelector('svg');
      if (svgElement && !targetContainer) {
        // For normal view
        svgElement.style.width = '100%';
        svgElement.style.height = 'auto';
        svgElement.style.display = 'block';
        svgElement.style.margin = '0 auto';
      } else if (svgElement && targetContainer) {
        // For fullscreen view
        svgElement.style.width = '100%';
        svgElement.style.height = '100%';
        svgElement.style.display = 'block';
        svgElement.style.transformOrigin = 'center center';
        
        const textElements = svgElement.querySelectorAll('text');
        textElements.forEach(textEl => {
          textEl.style.userSelect = 'text';
          textEl.style.cursor = 'text';
          textEl.style.pointerEvents = 'auto';
        });
      }
      
      setDiagramState(prev => ({
        ...prev,
        error: null,
        lastDiagramContent: diagram,
        isLoading: false
      }));
    } catch (err) {
      const error = err as Error;
      if (currentDiagramIdRef.current === null) return;
      
      let userFriendlyMessage = "Unable to render diagram";
      const lowerErrorMessage = error.message.toLowerCase();
      if (lowerErrorMessage.includes("syntax")) {
        userFriendlyMessage = "Invalid diagram syntax";
      } else if (lowerErrorMessage.includes("parse")) {
        userFriendlyMessage = "Diagram format error";
      } else if (lowerErrorMessage.includes("lexical")) {
        userFriendlyMessage = "Invalid diagram structure";
      } else if (lowerErrorMessage.includes("unexpected")) {
        userFriendlyMessage = "Unexpected diagram content";
      } else if (lowerErrorMessage.includes("expecting") && lowerErrorMessage.includes("got")) {
        userFriendlyMessage = "Invalid diagram syntax - missing or incorrect symbols";
      } else if (lowerErrorMessage.includes("pipe")) {
        userFriendlyMessage = "Invalid character usage in diagram";
      } else if (lowerErrorMessage.includes("diamond_stop") || lowerErrorMessage.includes("tagend")) {
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
      onError?.(error);
    }
  }, [diagram, onError]);

  // Effect for diagram changes and initial render
  useEffect(() => {
    if (diagram !== diagramState.lastDiagramContent) {
      setDiagramState(prev => ({
        ...prev,
        lastDiagramContent: diagram,
        error: null,
        showErrorDetails: false
      }));
      renderDiagram();
    } else if (!diagramState.error && diagram && containerRef.current && !containerRef.current.innerHTML) {
      // Fallback to render if container is empty (e.g. after error was cleared but content didn't change)
      renderDiagram();
    }
  }, [diagram, diagramState.lastDiagramContent, diagramState.error, renderDiagram]);

  // Optimized fullscreen toggle with better state management
  const toggleFullscreen = useCallback(() => {
    if (!fullscreenState.isFullscreen) {
      // Entering fullscreen
      setFullscreenState(prev => ({ ...prev, shouldShowModal: true, isAnimating: true }));
      
      scaleRef.current = 1;
      positionRef.current = { x: 0, y: 0 };
      setDiagramState(prev => ({ ...prev, scale: 1, position: { x: 0, y: 0 } }));
      
      setTimeout(() => {
        setFullscreenState(prev => ({ ...prev, isFullscreen: true, isAnimating: false }));
        setTimeout(() => {
          if (fullscreenContainerRef.current) {
            renderDiagram(fullscreenContainerRef.current);
          }
        }, 50); // Render after modal animation starts
      }, 16); // Single frame delay for CSS transition
    } else {
      // Exiting fullscreen
      setFullscreenState(prev => ({ ...prev, isAnimating: true }));
      setTimeout(() => {
        setFullscreenState(prev => ({
          ...prev,
          isFullscreen: false,
          shouldShowModal: false,
          isAnimating: false
        }));
      }, 250); // Duration of exit animation
    }
  }, [fullscreenState.isFullscreen, renderDiagram]);

  // Escape key handler for fullscreen
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullscreenState.isFullscreen) {
        // Directly trigger the exit part of toggleFullscreen for consistent animation/state handling
        // This was: setFullscreenState(prev => ({ ...prev, isFullscreen: false }));
        // To ensure proper animation and state cleanup, call toggleFullscreen if currently fullscreen
        toggleFullscreen();
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
  }, [fullscreenState.isFullscreen, toggleFullscreen]); // Added toggleFullscreen to dependencies

  // Mouse event handlers for fullscreen drag/pan
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!fullscreenState.isFullscreen) return;
    
    const target = e.target as HTMLElement;
    if (target.tagName === 'text' || target.closest('text')) {
      isTextSelectingRef.current = true;
      syncStateWithRefs();
      return;
    }
    
    isDraggingRef.current = true;
    lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
    
    if (diagramTransformRef.current) {
      diagramTransformRef.current.style.transition = 'none';
    }
    syncStateWithRefs();
    e.preventDefault();
  }, [fullscreenState.isFullscreen, syncStateWithRefs]);

  // Wheel event handler for fullscreen zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!fullscreenState.isFullscreen) return;
    e.preventDefault();
    
    const delta = e.deltaY * -0.001;
    const newScale = Math.max(0.1, Math.min(5, scaleRef.current + delta));
    
    scaleRef.current = newScale;
    updateTransform();
    syncStateWithRefs();
  }, [fullscreenState.isFullscreen, updateTransform, syncStateWithRefs]);

  // Reset zoom/pan state when leaving fullscreen
  useEffect(() => {
    if (!fullscreenState.isFullscreen) {
      scaleRef.current = 1;
      positionRef.current = { x: 0, y: 0 };
      isDraggingRef.current = false;
      isTextSelectingRef.current = false;
      
      setDiagramState(prev => ({
        ...prev,
        scale: 1,
        position: { x: 0, y: 0 },
        isDragging: false,
        isTextSelecting: false
      }));

      // Ensure visual reset if the element is still mounted
      if (diagramTransformRef.current) {
        diagramTransformRef.current.style.transform = 'translate(0px, 0px) scale(1)';
        diagramTransformRef.current.style.transition = 'none'; 
      }
    }
  }, [fullscreenState.isFullscreen]);

  // Global mouse event listeners for smoother dragging in fullscreen
  useEffect(() => {
    if (!fullscreenState.isFullscreen) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || isTextSelectingRef.current) return;
      
      const deltaX = e.clientX - lastMousePositionRef.current.x;
      const deltaY = e.clientY - lastMousePositionRef.current.y;
      
      positionRef.current = {
        x: positionRef.current.x + deltaX,
        y: positionRef.current.y + deltaY
      };
      lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
      
      updateTransform();
      e.preventDefault();
    };

    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        isTextSelectingRef.current = false; // Ensure text selection flag is also reset
        syncStateWithRefs();
        
        if (diagramTransformRef.current) {
          diagramTransformRef.current.style.transition = 'transform 0.1s ease-out';
        }
      }
    };
    
    // Named function for selectstart listener
    const preventSelectStart = (e: Event) => {
      if (isDraggingRef.current) e.preventDefault();
    };

    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('selectstart', preventSelectStart);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('selectstart', preventSelectStart);
    };
  }, [fullscreenState.isFullscreen, updateTransform, syncStateWithRefs]);

  // Wheel events for zooming in fullscreen
  useEffect(() => {
    const fullscreenElement = fullscreenContainerRef.current?.parentElement; // The scrollable area
    if (!fullscreenElement || !fullscreenState.isFullscreen) return;

    fullscreenElement.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      fullscreenElement.removeEventListener('wheel', handleWheel);
    };
  }, [fullscreenState.isFullscreen, handleWheel]);

  // Modal visibility cleanup
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

  // Error display
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
        <div className="p-6">
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

  // Main component render
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
            "fixed inset-0 z-50 flex items-center justify-center !m-0 transition-all duration-200 ease-out", // Added !m-0
            !fullscreenState.isFullscreen || fullscreenState.isAnimating
              ? "bg-black/0 backdrop-blur-none"
              : "bg-black/30 backdrop-blur-sm"
          )}
          onClick={toggleFullscreen} // Click on backdrop closes fullscreen
        >
          <div
            className={cn(
              "relative bg-white rounded-lg shadow-2xl w-full h-full max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col transition-all duration-200 ease-out",
              !fullscreenState.isFullscreen || fullscreenState.isAnimating
                ? "opacity-0 scale-90" 
                : "opacity-100 scale-100"
            )}
            onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
          >
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
              aria-label="Close fullscreen view"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
            
            {/* Fullscreen diagram area */}
            <div 
              className={cn(
                "flex-1 overflow-hidden flex items-center justify-center relative transition-all duration-200",
                diagramState.isTextSelecting ? "cursor-text" : diagramState.isDragging ? "cursor-grabbing" : "cursor-grab"
              )}
              onMouseDown={handleMouseDown}
              // onMouseMove, onMouseUp, onMouseLeave are removed here, relying on global listeners and handleMouseDown
              style={{
                userSelect: 'none', // Managed by CSS and text element styles
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

export const MermaidDiagram = memo(MermaidDiagramComponent);