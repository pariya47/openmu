"use client";

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

  const handleError = (error: Error) => {
    console.error("Mermaid diagram error:", error);
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
            Mermaid Diagram Test Page
          </Typography>
          <Typography 
            variant="muted" 
            className="max-w-2xl mx-auto"
          >
            Test the interactive Mermaid diagram component. Click on any diagram to view it in fullscreen mode.
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
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <Typography variant="h3" className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
            How to Test
          </Typography>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200">
            <li>• Click on any diagram to enter fullscreen mode</li>
            <li>• Press ESC or click outside to exit fullscreen</li>
            <li>• Try resizing your browser window to test responsiveness</li>
            <li>• Check the browser console for any error messages</li>
          </ul>
        </div>
      </div>
    </div>
  );
}