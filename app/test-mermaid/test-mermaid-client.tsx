"use client";

import { useState } from "react";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Zap,
  TestTube,
  GitBranch,
  BarChart3,
  Users,
  Calendar
} from "lucide-react";

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
      title Project Development Timeline
      dateFormat YYYY-MM-DD
      axisFormat %m/%d
      
      section Planning Phase
      Requirements Analysis    :done, req, 2024-01-01, 2024-01-10
      System Design          :done, design, 2024-01-08, 2024-01-22
      Architecture Planning  :done, arch, 2024-01-15, 2024-01-28
      
      section Development
      Frontend Development   :active, frontend, 2024-01-25, 2024-03-15
      Backend API           :backend, 2024-02-05, 2024-03-20
      Database Setup        :done, db, 2024-01-30, 2024-02-10
      
      section Testing & QA
      Unit Testing          :testing, 2024-02-20, 2024-03-25
      Integration Testing   :int-test, 2024-03-10, 2024-04-05
      User Acceptance       :uat, 2024-03-25, 2024-04-15
      
      section Deployment
      Production Setup      :deploy, 2024-04-01, 2024-04-10
      Go Live              :milestone, golive, 2024-04-15, 0d
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12 border-b pb-8">
          <Typography variant="h1" className="font-bold text-3xl">
            Mermaid Diagram Test Cases
          </Typography>
          
          <Typography variant="muted" className="max-w-2xl mx-auto">
            Comprehensive test cases for Mermaid diagram rendering, error handling, and interactive features.
          </Typography>
        </div>

        <div className="space-y-16">
          {/* Working Examples Section */}
          <section>
            <div className="space-y-8">
              {/* Flowchart Test Case */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Typography variant="h3" className="font-medium">Flowchart</Typography>
                  <Badge variant="outline" className="text-xs">Test Case 1</Badge>
                </div>
                <Typography variant="muted" className="text-sm">
                  Decision tree with conditional branching and loops.
                </Typography>
                <div className="border rounded p-4 min-h-[250px] bg-muted/20">
                  <MermaidDiagram 
                    diagram={flowchartDiagram}
                    onError={handleError}
                    className="w-full min-h-[200px]"
                    config={{ scale: 0.8 }}
                  />
                </div>
              </div>

              {/* Sequence Diagram Test Case */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Typography variant="h3" className="font-medium">Sequence Diagram</Typography>
                  <Badge variant="outline" className="text-xs">Test Case 2</Badge>
                </div>
                <Typography variant="muted" className="text-sm">
                  Actor interactions and message flow between system components.
                </Typography>
                <div className="border rounded p-4 min-h-[280px] bg-muted/20">
                  <MermaidDiagram 
                    diagram={sequenceDiagram}
                    onError={handleError}
                    className="w-full min-h-[230px]"
                    config={{ scale: 1.5 }}
                  />
                </div>
              </div>

              {/* Gantt Chart Test Case */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Typography variant="h3" className="font-medium">Gantt Chart</Typography>
                  <Badge variant="outline" className="text-xs">Test Case 3</Badge>
                </div>
                <Typography variant="muted" className="text-sm">
                  Project timeline with phases, tasks, and milestones.
                </Typography>
                <div className="border rounded p-6 min-h-[400px] bg-muted/20 overflow-x-auto">
                  <MermaidDiagram 
                    diagram={ganttDiagram}
                    onError={handleError}
                    className="w-full min-h-[350px]"
                    config={{ 
                      gantt: {
                        fontSize: 14,
                        fontFamily: 'system-ui, sans-serif',
                        gridLineStartPadding: 350,
                        bottomPadding: 50,
                        leftPadding: 120,
                        rightPadding: 100,
                        topPadding: 50,
                        barHeight: 25,
                        sectionFontSize: 16,
                        numberSectionStyles: 4
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Error Handling Section */}
          <section>
            <div className="mb-8">
              <Typography variant="h2" className="text-xl font-semibold mb-2">
                ⚠ Error Handling Tests
              </Typography>
              <Typography variant="muted" className="text-sm">
                Test cases for malformed syntax and error recovery mechanisms.
              </Typography>
            </div>

            <div className="space-y-8">
              {/* Static Error Test */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Typography variant="h3" className="font-medium">Static Error</Typography>
                  <Badge variant="destructive" className="text-xs">Test Case 4</Badge>
                </div>
                <Typography variant="muted" className="text-sm">
                  Persistent error state with malformed syntax (missing closing brackets).
                </Typography>
                <div className="border border-destructive/30 rounded p-4 min-h-[200px] bg-destructive/5">
                  <MermaidDiagram 
                    diagram={errorDiagram}
                    onError={handleError}
                    className="w-full min-h-[150px]"
                  />
                </div>
              </div>

              {/* Interactive Error Test */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Typography variant="h3" className="font-medium">Interactive Error Recovery</Typography>
                    <Badge variant="outline" className="text-xs">Test Case 5</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={fixInteractiveError}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      Fix Syntax
                    </Button>
                    <Button
                      onClick={breakInteractiveError}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      Break Syntax
                    </Button>
                  </div>
                </div>
                <Typography variant="muted" className="text-sm">
                  Dynamic syntax correction with automatic re-rendering. Toggle between error and success states.
                </Typography>
                <div className="border rounded p-4 min-h-[200px] bg-muted/20">
                  <MermaidDiagram 
                    diagram={interactiveErrorDiagram}
                    onError={handleError}
                    className="w-full min-h-[150px]"
                  />
                </div>
              </div>

              {/* First Load Error Test */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Typography variant="h3" className="font-medium">Initial Load Error</Typography>
                    <Badge variant="outline" className="text-xs">Test Case 6</Badge>
                  </div>
                  <Button
                    onClick={fixFirstLoadError}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    Recover Diagram
                  </Button>
                </div>
                <Typography variant="muted" className="text-sm">
                  Error on first load with recovery capability. Demonstrates error-to-success transition.
                </Typography>
                <div className="border rounded p-4 min-h-[200px] bg-muted/20">
                  <MermaidDiagram 
                    diagram={firstLoadErrorDiagram}
                    onError={handleError}
                    className="w-full min-h-[150px]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Test Instructions */}
          <section className="border-t pt-8">
            <div className="mb-6">
              <Typography variant="h2" className="text-xl font-semibold mb-2">
                Test Instructions
              </Typography>
              <Typography variant="muted" className="text-sm">
                Guidelines for manual testing and validation of diagram functionality.
              </Typography>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <Typography variant="h3" className="font-medium mb-3">General Testing</Typography>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Click any diagram to enter fullscreen mode</li>
                  <li>• Use ESC key or click outside to exit fullscreen</li>
                  <li>• Mouse wheel to zoom, drag to pan in fullscreen</li>
                  <li>• Test responsive behavior by resizing window</li>
                </ul>
              </div>
              
              <div>
                <Typography variant="h3" className="font-medium mb-3">Error Testing</Typography>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Test Case 4:</strong> Verify error display consistency</li>
                  <li>• <strong>Test Case 5:</strong> Toggle error/success states</li>
                  <li>• <strong>Test Case 6:</strong> Test error recovery workflow</li>
                  <li>• Check browser console for error logging</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}