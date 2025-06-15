'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MermaidDiagramProps, MermaidError } from '@/types/mermaid';

// Default Mermaid configuration
const DEFAULT_CONFIG = {
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose' as const,
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 14,
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
  },
  sequence: {
    useMaxWidth: true,
  },
  gantt: {
    useMaxWidth: true,
  },
  journey: {
    useMaxWidth: true,
  },
  gitgraph: {
    useMaxWidth: true,
  },
};

let mermaidInitialized = false;

/**
 * MermaidDiagram Component
 * 
 * A reusable React component for rendering Mermaid diagrams with proper error handling,
 * loading states, and dynamic updates.
 * 
 * @example
 * ```tsx
 * <MermaidDiagram 
 *   diagram="graph TD; A-->B; A-->C; B-->D; C-->D;"
 *   config={{ theme: 'dark' }}
 *   onRender={() => console.log('Diagram rendered')}
 *   onError={(error) => console.error('Diagram error:', error)}
 * />
 * ```
 */
export function MermaidDiagram({
  diagram,
  config = {},
  className,
  style,
  onRender,
  onError,
}: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<MermaidError | null>(null);
  const [diagramId] = useState(() => `mermaid-${Math.random().toString(36).substr(2, 9)}`);

  // Initialize Mermaid once globally
  const initializeMermaid = useCallback(() => {
    if (!mermaidInitialized) {
      const mergedConfig = { ...DEFAULT_CONFIG, ...config };
      mermaid.initialize(mergedConfig);
      mermaidInitialized = true;
    }
  }, [config]);

  // Create a custom error for Mermaid-specific issues
  const createMermaidError = useCallback((message: string, originalError?: unknown): MermaidError => {
    const error = new Error(message) as MermaidError;
    error.name = 'MermaidError';
    error.originalError = originalError;
    return error;
  }, []);

  // Render the diagram
  const renderDiagram = useCallback(async () => {
    if (!containerRef.current || !diagram.trim()) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      initializeMermaid();

      // Clear previous content
      containerRef.current.innerHTML = '';

      // Validate diagram syntax
      const isValid = await mermaid.parse(diagram);
      if (!isValid) {
        throw createMermaidError('Invalid Mermaid diagram syntax');
      }

      // Render the diagram
      const { svg } = await mermaid.render(diagramId, diagram);
      
      if (containerRef.current) {
        containerRef.current.innerHTML = svg;
        onRender?.();
      }
    } catch (err) {
      const mermaidError = createMermaidError(
        err instanceof Error ? err.message : 'Failed to render Mermaid diagram',
        err
      );
      setError(mermaidError);
      onError?.(mermaidError);
    } finally {
      setIsLoading(false);
    }
  }, [diagram, diagramId, initializeMermaid, createMermaidError, onRender, onError]);

  // Effect to render diagram when dependencies change
  useEffect(() => {
    renderDiagram();
  }, [renderDiagram]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center min-h-[200px] bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25",
          className
        )}
        style={style}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm font-medium">Rendering diagram...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center min-h-[200px] bg-destructive/5 rounded-lg border-2 border-dashed border-destructive/25",
          className
        )}
        style={style}
      >
        <div className="flex flex-col items-center gap-3 text-destructive max-w-md text-center p-4">
          <AlertTriangle className="h-8 w-8" />
          <div>
            <h3 className="font-semibold text-sm mb-1">Failed to render diagram</h3>
            <p className="text-xs text-destructive/80">{error.message}</p>
          </div>
          <button
            onClick={renderDiagram}
            className="text-xs bg-destructive/10 hover:bg-destructive/20 px-3 py-1 rounded transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Success state - rendered diagram
  return (
    <div 
      ref={containerRef}
      className={cn(
        "mermaid-diagram overflow-auto rounded-lg bg-background",
        "[&_svg]:max-w-full [&_svg]:h-auto",
        "[&_.node]:transition-all [&_.node]:duration-200",
        "[&_.edgePath]:transition-all [&_.edgePath]:duration-200",
        className
      )}
      style={style}
    />
  );
}

// Error boundary component for additional safety
interface MermaidErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class MermaidErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error }> }>,
  MermaidErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error }> }>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): MermaidErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('MermaidDiagram Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      
      if (FallbackComponent && this.state.error) {
        return <FallbackComponent error={this.state.error} />;
      }

      return (
        <div className="flex items-center justify-center min-h-[200px] bg-destructive/5 rounded-lg border-2 border-dashed border-destructive/25">
          <div className="flex flex-col items-center gap-3 text-destructive max-w-md text-center p-4">
            <AlertTriangle className="h-8 w-8" />
            <div>
              <h3 className="font-semibold text-sm mb-1">Component Error</h3>
              <p className="text-xs text-destructive/80">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}