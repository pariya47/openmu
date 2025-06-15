"use client";

import { useState } from "react";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { Typography } from "@/components/ui/typography";

export function TestMermaidClient() {
  const flowchartDiagram = `
    flowchart TD
      A[Start] --> B{Is it working?}
      B -->|Yes| C[Great!]
      B -->|No| D[Debug]
      D --> B
      C --> E[End]
  `;

  const sequenceDiagram = `
    sequenceDiagram
      participant User
      participant Browser
      participant Server
      User->>Browser: Click button
      Browser->>Server: Send request
      Server-->>Browser: Return data
      Browser-->>User: Display result
  `;

  const ganttDiagram = `
    gantt
      title Project Timeline
      dateFormat YYYY-MM-DD
      section Planning
      Research    :done, research, 2024-01-01, 2024-01-15
      Design      :done, design, 2024-01-10, 2024-01-25
      section Development
      Frontend    :active, frontend, 2024-01-20, 2024-02-15
      Backend     :backend, 2024-02-01, 2024-02-28
      Testing     :testing, 2024-02-20, 2024-03-10
  `;

  // Intentionally broken diagram for error testing
  const errorDiagram = `
    flowchart TD
      A[Start] --> B{Is it working?
      B -->|Yes| C[Great!]
      B -->|No| D[Debug
      D --> B
      C --> E[End]
  `;

  // State for interactive error test cases
  const [interactiveErrorDiagram, setInteractiveErrorDiagram] = useState(`
    flowchart TD
      A[Start] --> B{Missing closing bracket
      B -->|Yes| C[This will fail]
      B -->|No| D[Debug
      D --> B
      C --> E[End]
  `);

  const [firstLoadErrorDiagram, setFirstLoadErrorDiagram] = useState(`
    flowchart TD
      A[Error on first load] --> B{Broken syntax
      B --> C[Will be fixed]
  `);

  const handleError = (error: Error) => {
    console.error("Mermaid diagram error:", error);
  };

  const fixInteractiveError = () => {
    setInteractiveErrorDiagram(`
      flowchart TD
        A[Start] --> B{Now it works!}
        B -->|Yes| C[Success!]
        B -->|No| D[Debug]
        D --> B
        C --> E[End]
    `);
  };

  const breakInteractiveError = () => {
    setInteractiveErrorDiagram(`
      flowchart TD
        A[Start] --> B{Missing closing bracket
        B -->|Yes| C[This will fail]
        B -->|No| D[Debug
        D --> B
        C --> E[End]
    `);
  };

  const fixFirstLoadError = () => {
    setFirstLoadErrorDiagram(`
      flowchart TD
        A[Now fixed!] --> B{Perfect syntax}
        B --> C[Success!]
        B --> D[Working well]
        C --> E[End]
        D --> E
    `);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Typography 
            variant="h1" 
            className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent"
          >
            Mermaid Diagram Comprehensive Test Suite
          </Typography>
          <Typography 
            variant="muted" 
            className="max-w-2xl mx-auto"
          >
            Test the interactive Mermaid diagram component with various scenarios including error handling, recovery, and success cases.
          </Typography>
        </div>

        {/* Flowchart Example */}
        <div className="space-y-4">
          <Typography variant="h2" className="text-2xl font-semibold">
            Flowchart Diagram
          </Typography>
          <Typography variant="muted">
            A simple decision flowchart demonstrating conditional logic.
          </Typography>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
            <MermaidDiagram 
              diagram={flowchartDiagram}
              onError={handleError}
              className="w-full"
              config={{ scale: 0.8 }}
            />
          </div>
        </div>

        {/* Sequence Diagram Example */}
        <div className="space-y-4">
          <Typography variant="h2" className="text-2xl font-semibold">
            Sequence Diagram
          </Typography>
          <Typography variant="muted">
            Shows the interaction between different actors in a system.
          </Typography>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
            <MermaidDiagram 
              diagram={sequenceDiagram}
              onError={handleError}
              className="w-full"
              config={{ scale: 1.5 }}
            />
          </div>
        </div>

        {/* Gantt Chart Example */}
        <div className="space-y-4">
          <Typography variant="h2" className="text-2xl font-semibold">
            Gantt Chart
          </Typography>
          <Typography variant="muted">
            Project timeline visualization with tasks and dependencies.
          </Typography>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
            <MermaidDiagram 
              diagram={ganttDiagram}
              onError={handleError}
              className="w-full"
              config={{ scale: 1.2 }}
            />
          </div>
        </div>

        {/* Error Handling Test Case */}
        <div className="space-y-4">
          <Typography variant="h2" className="text-2xl font-semibold text-red-600 dark:text-red-400">
            Error Handling Test
          </Typography>
          <Typography variant="muted">
            This diagram contains intentional syntax errors to demonstrate error handling.
          </Typography>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
            <MermaidDiagram 
              diagram={errorDiagram}
              onError={handleError}
              className="w-full"
            />
          </div>
        </div>

        {/* Interactive Error -> Success Test Case */}
        <div className="space-y-4">
          <Typography variant="h2" className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
            Interactive Error ↔ Success Test
          </Typography>
          <Typography variant="muted">
            Test fixing and breaking diagram syntax dynamically. Notice how diagrams automatically re-render when fixed.
          </Typography>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg space-y-4">
            <div className="flex gap-2 mb-4">
              <button
                onClick={fixInteractiveError}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
              >
                Fix Diagram
              </button>
              <button
                onClick={breakInteractiveError}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
              >
                Break Diagram
              </button>
            </div>
            <MermaidDiagram 
              diagram={interactiveErrorDiagram}
              onError={handleError}
              className="w-full"
            />
          </div>
        </div>

        {/* First Load Error -> Fix Test Case */}
        <div className="space-y-4">
          <Typography variant="h2" className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
            First Load Error → Success Test
          </Typography>
          <Typography variant="muted">
            This diagram starts with an error on first load, then can be fixed to demonstrate error recovery.
          </Typography>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg space-y-4">
            <div className="flex gap-2 mb-4">
              <button
                onClick={fixFirstLoadError}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
              >
                Fix This Diagram
              </button>
            </div>
            <MermaidDiagram 
              diagram={firstLoadErrorDiagram}
              onError={handleError}
              className="w-full"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <Typography variant="h3" className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
            How to Test
          </Typography>
          <div className="space-y-4">
            <div>
              <Typography variant="muted" className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                General Testing:
              </Typography>
              <ul className="space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                <li>• Click on any diagram to enter fullscreen mode</li>
                <li>• Press ESC or click outside to exit fullscreen</li>
                <li>• Try resizing your browser window to test responsiveness</li>
              </ul>
            </div>
            
            <div>
              <Typography variant="muted" className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                Error Handling Testing:
              </Typography>
              <ul className="space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                <li>• <strong>Static Error Test:</strong> Shows persistent error state</li>
                <li>• <strong>Interactive Test:</strong> Use "Fix/Break Diagram" buttons to test error ↔ success transitions</li>
                <li>• <strong>First Load Error:</strong> Demonstrates error on initial load, then automatic recovery</li>
                <li>• Click "Show Details" on any error to see technical information</li>
                <li>• Diagrams automatically retry when syntax is fixed (no manual retry needed)</li>
                <li>• Check browser console - errors are only logged once per diagram change</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}