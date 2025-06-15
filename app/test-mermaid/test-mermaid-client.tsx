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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <TestTube className="h-8 w-8 text-primary-foreground" />
            </div>
            <Typography variant="h1" className="font-bold">
              Mermaid Test Suite
            </Typography>
          </div>
          
          <Typography variant="muted" className="max-w-3xl mx-auto text-lg">
            Comprehensive testing environment for interactive Mermaid diagrams with error handling, 
            recovery mechanisms, and fullscreen capabilities.
          </Typography>

          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Interactive Testing
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Error Handling
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Real-time Recovery
            </Badge>
          </div>
        </div>

        <div className="space-y-12">
          {/* Working Examples Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <Typography variant="h2" className="text-2xl font-semibold">
                Working Examples
              </Typography>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Flowchart Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="h-5 w-5 text-muted-foreground" />
                    <Badge variant="outline">Flowchart</Badge>
                  </div>
                  <CardTitle>Decision Flow</CardTitle>
                  <CardDescription>
                    Interactive decision flowchart demonstrating conditional logic and process flow.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 min-h-[250px]">
                    <MermaidDiagram 
                      diagram={flowchartDiagram}
                      onError={handleError}
                      className="w-full min-h-[200px]"
                      config={{ scale: 0.8 }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sequence Diagram Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <Badge variant="outline">Sequence</Badge>
                  </div>
                  <CardTitle>System Interaction</CardTitle>
                  <CardDescription>
                    Actor interactions showing communication flow between system components.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 min-h-[280px]">
                    <MermaidDiagram 
                      diagram={sequenceDiagram}
                      onError={handleError}
                      className="w-full min-h-[230px]"
                      config={{ scale: 1.5 }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gantt Chart - Full Width Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <Badge variant="outline">Timeline</Badge>
                </div>
                <CardTitle>Project Development Timeline</CardTitle>
                <CardDescription>
                  Comprehensive project management visualization with multiple phases, tasks, dependencies, and milestone tracking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 min-h-[400px] overflow-x-auto">
                  <MermaidDiagram 
                    diagram={ganttDiagram}
                    onError={handleError}
                    className="w-full min-h-[350px]"
                    config={{ 
                      gantt: {
                        fontSize: 14,
                        fontFamily: 'Inter, system-ui, sans-serif',
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
              </CardContent>
            </Card>
          </div>

          {/* Error Handling Tests Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <Typography variant="h2" className="text-2xl font-semibold">
                Error Handling & Recovery Tests
              </Typography>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Static Error Test */}
              <Card className="border-destructive/50">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <Badge variant="destructive">Static Error</Badge>
                  </div>
                  <CardTitle className="text-destructive">Persistent Error State</CardTitle>
                  <CardDescription>
                    Demonstrates consistent error handling with malformed syntax.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 min-h-[200px]">
                    <MermaidDiagram 
                      diagram={errorDiagram}
                      onError={handleError}
                      className="w-full min-h-[150px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Error Test */}
              <Card className="border-orange-500/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <RotateCcw className="h-5 w-5 text-orange-500" />
                        <Badge variant="outline" className="border-orange-300">Interactive</Badge>
                      </div>
                      <CardTitle className="text-orange-700 dark:text-orange-400">Dynamic Error ↔ Success</CardTitle>
                      <CardDescription>
                        Test real-time syntax correction and automatic re-rendering.
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={fixInteractiveError}
                      size="sm"
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Fix Syntax
                    </Button>
                    <Button
                      onClick={breakInteractiveError}
                      size="sm"
                      variant="destructive"
                      className="gap-2"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Break Syntax
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 min-h-[200px]">
                    <MermaidDiagram 
                      diagram={interactiveErrorDiagram}
                      onError={handleError}
                      className="w-full min-h-[150px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* First Load Error Test */}
              <Card className="border-purple-500/50 lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Play className="h-5 w-5 text-purple-500" />
                        <Badge variant="outline" className="border-purple-300">Recovery Test</Badge>
                      </div>
                      <CardTitle className="text-purple-700 dark:text-purple-400">Initial Load Error → Recovery</CardTitle>
                      <CardDescription>
                        Starts with broken syntax on first load, demonstrates error recovery capabilities.
                      </CardDescription>
                    </div>
                    <Button
                      onClick={fixFirstLoadError}
                      className="gap-2"
                    >
                      <Zap className="h-4 w-4" />
                      Recover Diagram
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 min-h-[200px]">
                    <MermaidDiagram 
                      diagram={firstLoadErrorDiagram}
                      onError={handleError}
                      className="w-full min-h-[150px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Instructions Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Testing Instructions</CardTitle>
              </div>
              <CardDescription>
                Complete guide for testing all diagram features and error scenarios.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <Badge className="mb-2">General Testing</Badge>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Click any diagram to enter fullscreen mode with pan/zoom controls</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Press ESC or click outside to exit fullscreen view</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Test responsiveness by resizing browser window</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Mouse wheel to zoom, drag to pan in fullscreen</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <Badge variant="destructive" className="mb-2">Error Testing</Badge>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Static Error:</strong> Shows persistent error handling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Interactive Test:</strong> Toggle between error and success states</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Recovery Test:</strong> Error on load → automatic recovery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                      <span>Check console - errors logged once per diagram change</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}