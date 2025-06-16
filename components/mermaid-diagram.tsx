"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';
import mermaid from 'mermaid';
import { cn } from '@/lib/utils';
import { AlertTriangle, X, Maximize2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogClose,
  ModernDialogClose,
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
  // lastMousePosition was here, removed as it's not used from state for rendering
  isTextSelecting: boolean;
}

// Fullscreen state
interface FullscreenState {
  isFullscreen: boolean;
  // Comment removed: isAnimating and shouldShowModal might be removed if Dialog handles them
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
    // lastMousePosition: { x: 0, y: 0 }, // Removed
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
  }, []); // Comment removed: Dependencies should be empty as it only uses refs and setState

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
        isTextSelecting: isTextSelectingRef.current
        // lastMousePosition: { ...lastMousePositionRef.current } // Removed
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
    // Comment removed: Optional: consider if cleanup is needed...
  }, [fullscreenState.isFullscreen, fullscreenContainerReady, renderDiagram]);

  // Escape key and body overflow are handled by Shadcn Dialog.
  // Comment removed: We might need to ensure onOpenChange on Dialog correctly calls toggleFullscreen(false)

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
      activeContainer.addEventListener('wheel', handleWheel as EventListener, { passive: false });
      return () => {
        activeContainer.removeEventListener('wheel', handleWheel as EventListener);
      };
    }
  }, [fullscreenState.isFullscreen, handleWheel]); // Comment removed: Rerun if fullscreen state changes

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
      // More user-friendly default message
      errorData = { 
        userMessage: "Oops! Something went wrong while preparing the diagram.",
        technicalMessage: diagramState.error,
        timestamp: new Date().toISOString()
      };
    }

    return (
      <Alert variant="destructive" className={cn("relative", className)}>
        <div className="flex items-start gap-x-3"> {/* Use gap-x for horizontal spacing only if needed, gap-3 is fine */}
          <div className="flex-shrink-0 pt-0.5"> {/* Adjusted pt for better alignment with new title size */}
            <AlertTriangle className="h-5 w-5" aria-hidden="true" /> {/* text color will be inherited, explicit aria-hidden */}
          </div>
          <div className="flex-1 space-y-2"> {/* Increased space-y for better separation */}
            <AlertTitle className="text-lg font-semibold"> {/* Prominent title */}
              {errorData?.userMessage || "Oops! There's a problem with this diagram."}
            </AlertTitle>
            <AlertDescription className="text-sm"> {/* Ensure consistent text size for description */}
              We encountered an issue trying to display this diagram. You can try to fix the syntax if applicable, or see more technical details below.
              <div className="mt-3 mb-2"> {/* Added margin top and bottom for the button */}
                <Button
                  variant="outline" // Changed variant for better visual distinction
                  size="sm"
                  onClick={() => setDiagramState(prev => ({
                    ...prev,
                    showErrorDetails: !prev.showErrorDetails
                  }))}
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" // Better contrast with destructive colors
                  aria-expanded={diagramState.showErrorDetails} // For accessibility
                  aria-controls="error-details" // For accessibility
                >
                  {diagramState.showErrorDetails ? 'Hide Details' : 'Show Details'}
                </Button>
              </div>
              {diagramState.showErrorDetails && errorData && (
                <div
                  id="error-details" // For aria-controls
                  className="mt-3 p-3 rounded-md border bg-red-50 dark:bg-red-900/40 border-red-300 dark:border-red-700" // Enhanced styling
                >
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-100 mb-1.5"> {/* Adjusted heading */}
                    Technical Details:
                  </h4>
                  <code className="block whitespace-pre-wrap break-all text-xs text-red-700 dark:text-red-200 font-mono bg-transparent p-0"> {/* Ensure code block respects formatting and is readable */}
                    {errorData.technicalMessage}
                  </code>
                  <div className="text-xs text-red-500 dark:text-red-400 mt-2"> {/* Adjusted text color & margin */}
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
          <div
            className="flex flex-col items-center justify-center p-8 space-y-4"
            aria-busy="true"
            aria-live="polite"
            role="status"
            aria-label="Loading diagram preview..."
          >
            <Skeleton className="h-12 w-1/2" />
            <div className="flex w-full justify-around space-x-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-8 w-1/3" />
            </div>
            <Skeleton className="h-10 w-3/4" />
          </div>
        )}
        <div 
          ref={containerRef}
          className={cn(
            "mermaid-container transition-opacity duration-200 w-full overflow-visible flex items-center justify-center",
            diagramState.isLoading ? "opacity-0" : "opacity-100"
          )}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100" aria-hidden="true"> {/* Hide decorative hover overlay from AT */}
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg dark:bg-slate-800/90">
            <Maximize2 className="h-5 w-5 text-foreground/70 group-hover:text-foreground/90" aria-hidden="true" /> {/* Icon is decorative, parent button has label */}
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

          <DialogClose asChild>
            <ModernDialogClose 
              variant="ghost" 
              size="icon"
              className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background/90 hover:scale-110 transition-all duration-200 ease-in-out"
              iconClass="h-5 w-5"
            />
          </DialogClose>

          {/* Zoom controls */}
          <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            {/* Increased gap for better spacing, and adjusted label margin */}
            <div className="flex items-center gap-1.5 text-sm">
              <span className="mr-2 text-muted-foreground">Zoom: {Math.round(diagramState.scale * 100)}%</span>
              <Button
                variant="outline"
                size="sm"
                aria-label="Zoom out" // Accessibility: Added aria-label
                className="transition-transform duration-100 ease-in-out hover:scale-105 active:scale-95" // Styling: Added hover/active effects
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
                aria-label="Reset zoom" // Accessibility: Added aria-label
                className="transition-transform duration-100 ease-in-out hover:scale-105 active:scale-95" // Styling: Added hover/active effects
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
                aria-label="Zoom in" // Accessibility: Added aria-label
                className="transition-transform duration-100 ease-in-out hover:scale-105 active:scale-95" // Styling: Added hover/active effects
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

          {/* Modern Close Button with text */}
          <div className="absolute bottom-4 right-4">
            <ModernDialogClose
              variant="outline"
              size="sm"
              className="bg-background/80 backdrop-blur-sm border-border shadow-lg hover:bg-background/90 hover:border-primary/50 transition-all duration-200"
            >
              <X className="h-4 w-4 mr-2" />
              Close Fullscreen
            </ModernDialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const MermaidDiagram = memo(MermaidDiagramComponent);