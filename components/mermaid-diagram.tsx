"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';
import mermaid from 'mermaid';
import { cn } from '@/lib/utils';
import { AlertTriangle, X, Maximize2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog';

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

// Fullscreen state
interface FullscreenState {
  isFullscreen: boolean;
  // isAnimating and shouldShowModal might be removed if Dialog handles them
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
  });
  const [fullscreenContainerReady, setFullscreenContainerReady] = useState(false);

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
    diagramTransformRef.current = el; // This is for pan/zoom styling
    setFullscreenContainerReady(!!el);
  }, []); // Dependencies should be empty as it only uses refs and setState

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

  // Fullscreen toggle logic
  const toggleFullscreen = useCallback(() => {
    const enteringFullscreen = !fullscreenState.isFullscreen;
    setFullscreenState(prev => ({ ...prev, isFullscreen: enteringFullscreen }));

    if (enteringFullscreen) {
      // Reset pan/zoom state when entering fullscreen
      scaleRef.current = 1;
      positionRef.current = { x: 0, y: 0 };
      // Update diagram state immediately for transform, though actual rendering might be delayed
      setDiagramState(prev => ({ ...prev, scale: 1, position: { x: 0, y: 0 } }));
      
      // Diagram rendering in fullscreen is handled by an effect watching isFullscreen
    }
    // Cleanup (like resetting body overflow) is handled by Dialog's onOpenChange or unmount
  }, [fullscreenState.isFullscreen]);

  // Effect to render diagram when fullscreen is activated and container is ready
  useEffect(() => {
    if (fullscreenState.isFullscreen && fullscreenContainerReady && fullscreenContainerRef.current) {
      renderDiagram(fullscreenContainerRef.current);
    }
    // Optional: consider if cleanup is needed if fullscreenContainerReady becomes false while in fullscreen
    // For now, existing cleanup in renderDiagram (clearing innerHTML) should suffice on subsequent renders.
  }, [fullscreenState.isFullscreen, fullscreenContainerReady, renderDiagram]);

  // Escape key and body overflow are handled by Shadcn Dialog.
  // We might need to ensure onOpenChange on Dialog correctly calls toggleFullscreen(false)

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
    // Attaching to DialogContent or a specific scrollable area within it
    const activeContainer = fullscreenState.isFullscreen && fullscreenContainerRef.current
      ? fullscreenContainerRef.current.closest('[role="dialog"]') // Find DialogContent
      : null;

    if (activeContainer) {
      activeContainer.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        activeContainer.removeEventListener('wheel', handleWheel);
      };
    }
  }, [fullscreenState.isFullscreen, handleWheel]); // Rerun if fullscreen state changes

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
      <Alert variant="destructive" className={cn("relative", className)}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5"> {/* Adjusted margin for better alignment with AlertTriangle */}
            <AlertTriangle className="h-5 w-5" /> {/* text color will be inherited */}
          </div>
          <div className="flex-1 space-y-1"> {/* Reduced space-y for tighter packing */}
            <AlertTitle>
              {errorData?.userMessage || "Unable to render diagram"}
            </AlertTitle>
            <AlertDescription>
              There was an issue rendering this diagram. The diagram will automatically retry when you fix the syntax.
              <div className="flex items-center gap-2 mt-2"> {/* Adjusted margin */}
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setDiagramState(prev => ({
                    ...prev,
                    showErrorDetails: !prev.showErrorDetails
                  }))}
                  // Adjusted text color for destructive variant, or rely on Button's default for link
                  className="px-0 h-auto text-destructive-foreground/80 hover:text-destructive-foreground"
                >
                  {diagramState.showErrorDetails ? 'Hide' : 'Show'} Details
                </Button>
              </div>
              {diagramState.showErrorDetails && errorData && (
                <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800">
                  <h4 className="text-xs font-medium text-red-800 dark:text-red-200 mb-1"> {/* Reduced margin */}
                    Technical Details:
                  </h4>
                  <code className="text-xs text-red-700 dark:text-red-300 font-mono break-all">
                    {errorData.technicalMessage}
                  </code>
                  <div className="text-xs text-red-600 dark:text-red-400 mt-1"> {/* Reduced margin */}
                    Time: {new Date(errorData.timestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </AlertDescription>
          </div>
        </div>
      </Alert>
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
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg dark:bg-slate-800/90">
            <Maximize2 className="h-5 w-5 text-foreground/70 group-hover:text-foreground/90" />
          </div>
        </div>
      </div>

      <Dialog open={fullscreenState.isFullscreen} onOpenChange={(isOpen) => {
        if (!isOpen) {
          // Ensure toggleFullscreen is called to correctly reset state if Dialog is closed via Esc or overlay click
          if (fullscreenState.isFullscreen) toggleFullscreen();
        }
      }}>
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] w-full h-full flex flex-col p-0 sm:rounded-lg overflow-hidden"
          onOpenAutoFocus={(e) => e.preventDefault()} // Prevent focus stealing from diagram
          onPointerDownOutside={(e) => e.preventDefault()} // Allow interaction with diagram elements like text
          onInteractOutside={(e) => e.preventDefault()} // Allow interaction with diagram elements like text
        >
          <DialogTitle className="sr-only">Fullscreen Diagram View</DialogTitle>
          {/* Fullscreen diagram area */}
          <div
            className={cn(
              "flex-1 overflow-hidden flex items-center justify-center relative", // Removed transition-all, Dialog handles it
              diagramState.isTextSelecting ? "cursor-text" : diagramState.isDragging ? "cursor-grabbing" : "cursor-grab"
            )}
            onMouseDown={handleMouseDown}
            style={{
              userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'
            }}
          >
            <div 
              ref={setFullscreenContainerRef}
              className="mermaid-fullscreen w-full h-full flex items-center justify-center" // Ensure it fills the space
              style={{
                transform: `translate(${diagramState.position.x}px, ${diagramState.position.y}px) scale(${diagramState.scale})`,
                transformOrigin: 'center center',
                transition: diagramState.isDragging ? 'none' : 'transform 0.1s ease-out',
                willChange: 'transform'
              }}
            />
          </div>

          <DialogClose asChild className="absolute top-3 right-3 z-10">
            <Button variant="ghost" size="icon" aria-label="Close fullscreen view">
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>

          {/* Zoom controls */}
          <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            <div className="flex items-center gap-1 text-sm ">
              <span className="mr-1 text-muted-foreground">Zoom: {Math.round(diagramState.scale * 100)}%</span>
              <Button
                variant="outline"
                size="sm" // Changed to sm for consistency
                onClick={(e) => {
                  e.stopPropagation();
                  const newScale = Math.max(0.1, scaleRef.current - 0.1);
                  scaleRef.current = newScale;
                  updateTransform();
                  syncStateWithRefs();
                }}
              >
                -
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  scaleRef.current = 1;
                  positionRef.current = { x: 0, y: 0 };
                  updateTransform();
                  syncStateWithRefs();
                }}
              >
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  const newScale = Math.min(5, scaleRef.current + 0.1);
                  scaleRef.current = newScale;
                  updateTransform();
                  syncStateWithRefs();
                }}
              >
                +
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const MermaidDiagram = memo(MermaidDiagramComponent);