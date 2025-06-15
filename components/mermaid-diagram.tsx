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
  const [renderedSvg, setRenderedSvg] = useState<string>('');

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      sequence: {
        useMaxWidth: true,
        wrap: true,
        width: 150,
        height: 65
      },
      gantt: {
        useMaxWidth: true,
        leftPadding: 75,
        gridLineStartPadding: 35,
        fontSize: 11,
        sectionFontSize: 24,
        numberSectionStyles: 4
      },
      ...config
    });
  }, [config]);

  // Render diagram
  const renderDiagram = useCallback(async () => {
    if (!diagram) return;

    setIsLoading(true);
    setError(null);

    try {
      // Generate unique ID for this diagram
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      
      // Render the diagram
      const { svg } = await mermaid.render(id, diagram);
      setRenderedSvg(svg);
      setIsLoading(false);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      setIsLoading(false);
      onError?.(error);
    }
  }, [diagram, onError]);

  // Apply sizing to SVG based on container and diagram type
  const applySizing = useCallback((container: HTMLDivElement, isFullscreenView: boolean) => {
    if (!container || !renderedSvg) return;

    container.innerHTML = renderedSvg;
    const svgElement = container.querySelector('svg');
    
    if (svgElement) {
      // Remove existing dimensions
      svgElement.removeAttribute('width');
      svgElement.removeAttribute('height');
      
      // Detect diagram type from the diagram string
      const diagramType = diagram.trim().split('\n')[0].trim().toLowerCase();
      
      if (isFullscreenView) {
        // Fullscreen sizing
        svgElement.style.width = '100%';
        svgElement.style.height = 'auto';
        svgElement.style.maxWidth = '90vw';
        svgElement.style.maxHeight = '80vh';
        
        if (diagramType.includes('gantt')) {
          // Gantt charts need more space in fullscreen
          svgElement.style.minWidth = '800px';
          svgElement.style.minHeight = '400px';
        }
      } else {
        // Normal view sizing
        if (diagramType.includes('flowchart')) {
          // Flowcharts: constrain size to prevent them from being too large
          svgElement.style.width = '100%';
          svgElement.style.height = 'auto';
          svgElement.style.maxWidth = '600px';
          svgElement.style.maxHeight = '400px';
        } else if (diagramType.includes('sequencediagram')) {
          // Sequence diagrams: ensure minimum readable size
          svgElement.style.width = '100%';
          svgElement.style.height = 'auto';
          svgElement.style.minWidth = '500px';
          svgElement.style.minHeight = '300px';
        } else if (diagramType.includes('gantt')) {
          // Gantt charts: ensure they're wide enough to be readable
          svgElement.style.width = '100%';
          svgElement.style.height = 'auto';
          svgElement.style.minWidth = '700px';
          svgElement.style.minHeight = '250px';
        } else {
          // Default sizing for other diagram types
          svgElement.style.width = '100%';
          svgElement.style.height = 'auto';
          svgElement.style.maxWidth = '100%';
        }
      }
      
      // Center the diagram
      svgElement.style.display = 'block';
      svgElement.style.margin = '0 auto';
    }
  }, [renderedSvg, diagram]);

  // Update normal view when SVG is rendered
  useEffect(() => {
    if (containerRef.current && renderedSvg && !isLoading) {
      applySizing(containerRef.current, false);
    }
  }, [renderedSvg, isLoading, applySizing]);

  // Update fullscreen view when opened
  useEffect(() => {
    if (fullscreenContainerRef.current && renderedSvg && isFullscreen) {
      applySizing(fullscreenContainerRef.current, true);
    }
  }, [isFullscreen, renderedSvg, applySizing]);

  // Re-render when diagram changes
  useEffect(() => {
    renderDiagram();
  }, [renderDiagram]);

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

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
          "relative group cursor-pointer transition-all duration-200 hover:shadow-lg overflow-auto",
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
            "mermaid-container transition-opacity duration-200",
            isLoading ? "opacity-0" : "opacity-100"
          )}
        />
        
        {/* Hover overlay */}
        {!isLoading && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
              <Maximize2 className="h-5 w-5 text-gray-700" />
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={toggleFullscreen}
        >
          <div 
            className="relative bg-white rounded-lg shadow-2xl max-w-[95vw] max-h-[95vh] overflow-auto"
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
            
            {/* Fullscreen diagram */}
            <div className="p-8">
              <div 
                ref={fullscreenContainerRef}
                className="mermaid-fullscreen"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}