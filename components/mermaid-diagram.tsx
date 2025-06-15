"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { cn } from '@/lib/utils';
import { Maximize2, X } from 'lucide-react';

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
  
  // Fullscreen zoom and pan state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
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
        // For fullscreen view - prepare for zoom/pan
        svgElement.style.width = '100%';
        svgElement.style.height = '100%';
        svgElement.style.display = 'block';
        svgElement.style.transformOrigin = 'center center';
      }
      
      setIsLoading(false);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      setIsLoading(false);
      onError?.(error);
    }
  }, [diagram, onError]);

  // Re-render when diagram changes
  useEffect(() => {
    renderDiagram();
  }, [renderDiagram]);

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      // Reset zoom and position when entering fullscreen
      setScale(1);
      setPosition({ x: 0, y: 0 });
      // Re-render diagram for fullscreen
      setTimeout(() => {
        if (fullscreenContainerRef.current) {
          renderDiagram(fullscreenContainerRef.current);
        }
      }, 100);
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
    setIsDragging(true);
    setLastMousePosition({ x: e.clientX, y: e.clientY });
  }, [isFullscreen]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !isFullscreen) return;
    
    const deltaX = e.clientX - lastMousePosition.x;
    const deltaY = e.clientY - lastMousePosition.y;
    
    setPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setLastMousePosition({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastMousePosition, isFullscreen]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
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
    }
  }, [isFullscreen]);

  if (error) {
    return (
      <div className={cn(
        "p-4 border border-destructive/20 rounded-lg bg-destructive/5",
        className
      )}>
        <p className="text-destructive text-sm">
          Error rendering diagram: {error}
        </p>
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
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={toggleFullscreen}
        >
          <div 
            className="relative bg-white rounded-lg shadow-2xl w-full h-full max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col"
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
              className="flex-1 overflow-hidden flex items-center justify-center relative cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              style={{ 
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
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