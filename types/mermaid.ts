import type { MermaidConfig } from 'mermaid';

export interface MermaidDiagramProps {
  /** The Mermaid diagram definition in text format */
  diagram: string;
  /** Optional Mermaid initialization configuration */
  config?: MermaidConfig;
  /** Optional CSS class name for the container */
  className?: string;
  /** Optional inline styles for the container */
  style?: React.CSSProperties;
  /** Callback fired when diagram renders successfully */
  onRender?: () => void;
  /** Callback fired when diagram fails to render */
  onError?: (error: Error) => void;
}

export interface MermaidError extends Error {
  name: 'MermaidError';
  message: string;
  originalError?: unknown;
}