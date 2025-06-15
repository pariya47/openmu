'use client';

import React, { useState } from 'react';
import { MermaidDiagram, MermaidErrorBoundary } from '@/components/ui/mermaid-diagram';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw } from 'lucide-react';

const EXAMPLE_DIAGRAMS = {
  flowchart: `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> E[Fix issue]
    E --> B
    C --> F[End]`,
  
  sequence: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    participant C as Charlie
    
    A->>B: Hello Bob!
    B->>C: Hello Charlie!
    C-->>B: Hi Bob!
    B-->>A: Hi Alice!`,
  
  gantt: `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Planning
    Research        :done, research, 2024-01-01, 2024-01-15
    Design          :done, design, after research, 10d
    section Development
    Frontend        :active, frontend, 2024-01-20, 20d
    Backend         :backend, after frontend, 15d
    Testing         :testing, after backend, 10d`,
  
  classDiagram: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    class Cat {
        +String color
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
  
  gitgraph: `gitgraph
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    branch feature
    checkout feature
    commit
    checkout main
    merge feature`,
};

export function MermaidDemo() {
  const [selectedExample, setSelectedExample] = useState<keyof typeof EXAMPLE_DIAGRAMS>('flowchart');
  const [customDiagram, setCustomDiagram] = useState('');
  const [renderCount, setRenderCount] = useState(0);

  const handleCopyDiagram = (diagram: string) => {
    navigator.clipboard.writeText(diagram);
  };

  const handleRenderSuccess = () => {
    setRenderCount(prev => prev + 1);
  };

  const handleRenderError = (error: Error) => {
    console.error('Diagram render error:', error);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Mermaid Diagram Component
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A production-ready React component for rendering Mermaid diagrams with TypeScript support, 
          error handling, and dynamic updates.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary">Renders: {renderCount}</Badge>
          <Badge variant="outline">TypeScript</Badge>
          <Badge variant="outline">Error Boundaries</Badge>
          <Badge variant="outline">Loading States</Badge>
        </div>
      </div>

      <Tabs defaultValue="examples" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="examples">Example Diagrams</TabsTrigger>
          <TabsTrigger value="custom">Custom Diagram</TabsTrigger>
        </TabsList>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Example Diagrams</CardTitle>
              <CardDescription>
                Choose from various Mermaid diagram types to see the component in action
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {Object.keys(EXAMPLE_DIAGRAMS).map((type) => (
                  <Button
                    key={type}
                    variant={selectedExample === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedExample(type as keyof typeof EXAMPLE_DIAGRAMS)}
                    className="capitalize"
                  >
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </Button>
                ))}
              </div>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => handleCopyDiagram(EXAMPLE_DIAGRAMS[selectedExample])}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                
                <MermaidErrorBoundary>
                  <MermaidDiagram
                    diagram={EXAMPLE_DIAGRAMS[selectedExample]}
                    config={{ theme: 'default' }}
                    className="border rounded-lg p-4 bg-card"
                    onRender={handleRenderSuccess}
                    onError={handleRenderError}
                  />
                </MermaidErrorBoundary>
              </div>

              <details className="bg-muted/30 rounded-lg p-4">
                <summary className="cursor-pointer font-medium mb-2">View Source Code</summary>
                <pre className="text-sm bg-background rounded p-3 overflow-x-auto">
                  <code>{EXAMPLE_DIAGRAMS[selectedExample]}</code>
                </pre>
              </details>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Diagram</CardTitle>
              <CardDescription>
                Write your own Mermaid diagram and see it rendered in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Diagram Definition</label>
                  <Textarea
                    placeholder="Enter your Mermaid diagram here..."
                    value={customDiagram}
                    onChange={(e) => setCustomDiagram(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCustomDiagram(EXAMPLE_DIAGRAMS.flowchart)}
                    >
                      Load Example
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCustomDiagram('')}
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Rendered Output</label>
                  <div className="border rounded-lg min-h-[300px]">
                    {customDiagram.trim() ? (
                      <MermaidErrorBoundary>
                        <MermaidDiagram
                          diagram={customDiagram}
                          config={{ theme: 'default' }}
                          className="p-4"
                          onRender={handleRenderSuccess}
                          onError={handleRenderError}
                        />
                      </MermaidErrorBoundary>
                    ) : (
                      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        Enter a diagram definition to see the preview
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Component Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">TypeScript Support</h4>
              <p className="text-sm text-muted-foreground">
                Full TypeScript definitions for props and configuration options
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Error Handling</h4>
              <p className="text-sm text-muted-foreground">
                Graceful error handling with fallback UI and retry functionality
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Loading States</h4>
              <p className="text-sm text-muted-foreground">
                Beautiful loading indicators while diagrams are being rendered
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Dynamic Updates</h4>
              <p className="text-sm text-muted-foreground">
                Automatically re-renders when diagram content changes
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Error Boundaries</h4>
              <p className="text-sm text-muted-foreground">
                React error boundaries prevent crashes and show helpful messages
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Customizable</h4>
              <p className="text-sm text-muted-foreground">
                Configurable themes, styling, and Mermaid options
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}