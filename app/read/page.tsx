"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  ArrowLeft,
  FileText,
  Search,
  RefreshCw,
  Mail,
  ChevronRight,
  ChevronDown,
  Eye,
  Layers,
  Code,
  Zap,
  Settings,
  Database,
  Brain,
  Target,
  Lightbulb,
  GitBranch,
  Cpu,
  Network,
  BarChart3,
  Clock,
  Users,
  Globe,
  Download,
  Share,
  Bookmark,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

interface TopicItem {
  id: string;
  title: string;
  isExpanded?: boolean;
  children?: TopicItem[];
}

export default function ReadPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('overview');
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set(['overview', 'architecture']));

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const topics: TopicItem[] = [
    {
      id: 'overview',
      title: 'Overview',
      children: [
        { id: 'core-architecture', title: 'Core Architecture' },
        { id: 'base-classes', title: 'Base Classes and Model Loading' },
        { id: 'auto-classes', title: 'Auto Classes System' },
        { id: 'tokenization', title: 'Tokenization System' },
        { id: 'pipeline', title: 'Pipeline System' },
        { id: 'training', title: 'Training System' },
        { id: 'trainer-class', title: 'Trainer Class' },
        { id: 'training-args', title: 'Training Arguments' },
        { id: 'callbacks', title: 'Callbacks and Extensions' },
        { id: 'generation', title: 'Generation System' },
        { id: 'generation-strategies', title: 'Generation Strategies' },
        { id: 'logic-processing', title: 'Logic Processing' },
        { id: 'caching', title: 'Caching Mechanisms' },
        { id: 'model-implementations', title: 'Model Implementations' },
        { id: 'llm-architectures', title: 'LLM Architectures' },
        { id: 'audio-models', title: 'Audio Models' },
        { id: 'multimodal', title: 'Multimodal Models' },
        { id: 'advanced-features', title: 'Advanced Features' },
        { id: 'quantization', title: 'Quantization' },
        { id: 'gguf-integration', title: 'GGUF Integration' }
      ]
    }
  ];

  const contentSections = [
    {
      id: 'library-purpose',
      title: 'Library Purpose and Scope',
      content: `Transformers is designed to democratize access to state-of-the-art machine learning models by providing:

• Unified Model Access: A consistent API across 5000+ model architectures through Auto classes
• Multi-Framework Support: Native implementations for PyTorch, TensorFlow, and JAX/Flax  
• Production-Ready Inference: Optimized Pipeline API for common tasks
• Comprehensive Training: Full training infrastructure with the Trainer class
• Advanced Generation: Sophisticated text generation with multiple decoding strategies
• Memory Optimization: Quantization support and efficient caching mechanisms`
    },
    {
      id: 'relevant-files',
      title: 'Relevant source files',
      content: 'Key implementation files and their purposes in the codebase structure.'
    }
  ];

  const toggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const renderTopicTree = (topics: TopicItem[], level = 0) => {
    return topics.map((topic) => (
      <div key={topic.id} className={`${level > 0 ? 'ml-4' : ''}`}>
        <div
          className={`flex items-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
            selectedTopic === topic.id ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700' : 'text-gray-700'
          }`}
          onClick={() => {
            setSelectedTopic(topic.id);
            if (topic.children) {
              toggleTopic(topic.id);
            }
          }}
        >
          {topic.children && (
            <div className="mr-2">
              {expandedTopics.has(topic.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )}
          <span className={`text-sm ${level === 0 ? 'font-medium' : 'font-normal'}`}>
            {topic.title}
          </span>
        </div>
        {topic.children && expandedTopics.has(topic.id) && (
          <div className="mt-1">
            {renderTopicTree(topic.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-black text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-black">SUMU</span>
              <Separator orientation="vertical" className="h-6" />
              <span className="text-sm text-gray-600">huggingface/transformers</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="text-xs">
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh this wiki
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Mail className="h-3 w-3 mr-1" />
                Enter email to refresh
              </Button>
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Share className="h-3 w-3 mr-1" />
                Share
              </Button>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Topics */}
          <div className="col-span-3">
            <Card className="sticky top-24 max-h-[calc(100vh-8rem)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900">Topics</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-12rem)]">
                  <div className="px-4 pb-4">
                    {renderTopicTree(topics)}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-6">
            <div className="space-y-6">
              {/* Overview Section */}
              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-gray-900">Overview</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      Last indexed: 6 June 2025 (GMT+8)
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Relevant source files</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      The Hugging Face Transformers library is a comprehensive machine learning framework that 
                      provides state-of-the-art pretrained models for natural language processing, computer vision, 
                      audio processing, and multimodal tasks. This library serves as both an inference engine and training 
                      platform offering over 100,000 model checkpoints across multiple modalities and frameworks.
                    </p>
                    <p className="text-gray-600 text-sm">
                      This document covers the foundational architecture, core systems, and design patterns that enable 
                      Transformers to provide a unified API for diverse model architectures and tasks. For detailed 
                      information about specific components, see <span className="text-blue-600 underline cursor-pointer">Core Architecture</span>, <span className="text-blue-600 underline cursor-pointer">Training System</span>, 
                      and <span className="text-blue-600 underline cursor-pointer">Model Implementations</span>.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-blue-600" />
                      Library Purpose and Scope
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 text-sm mb-4">
                        Transformers is designed to democratize access to state-of-the-art machine learning models by providing:
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <span className="font-medium text-gray-800">Unified Model Access:</span>
                            <span className="text-gray-600 text-sm ml-1">A consistent API across 5000+ model architectures through Auto classes</span>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <span className="font-medium text-gray-800">Multi-Framework Support:</span>
                            <span className="text-gray-600 text-sm ml-1">Native implementations for PyTorch, TensorFlow, and JAX/Flax</span>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <span className="font-medium text-gray-800">Production-Ready Inference:</span>
                            <span className="text-gray-600 text-sm ml-1">Optimized Pipeline API for common tasks</span>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <span className="font-medium text-gray-800">Comprehensive Training:</span>
                            <span className="text-gray-600 text-sm ml-1">Full training infrastructure with the Trainer class</span>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <span className="font-medium text-gray-800">Advanced Generation:</span>
                            <span className="text-gray-600 text-sm ml-1">Sophisticated text generation with multiple decoding strategies</span>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <span className="font-medium text-gray-800">Memory Optimization:</span>
                            <span className="text-gray-600 text-sm ml-1">Quantization support and efficient caching mechanisms</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Research Insights */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <Brain className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">AI Research Insights</h4>
                        <p className="text-blue-800 text-sm">
                          Ask Devin about huggingface/transformers for deeper analysis and implementation guidance.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Deep Research Section */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start space-x-3">
                      <Search className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">Deep Research</h4>
                        <p className="text-green-800 text-sm mb-3">
                          Consistency: Standardized interfaces across all implementations
                        </p>
                        <div className="text-xs text-green-700">
                          Vector search required
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Analysis
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save Research
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask Questions
                </Button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - On This Page */}
          <div className="col-span-3">
            <Card className="sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900">On this page</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">
                    Overview
                  </div>
                  <div className="ml-3 space-y-1">
                    <div className="text-xs text-gray-500 hover:text-blue-600 cursor-pointer transition-colors flex items-center">
                      <ChevronRight className="h-3 w-3 mr-1" />
                      Library Purpose and Scope
                    </div>
                    <div className="text-xs text-gray-500 hover:text-blue-600 cursor-pointer transition-colors flex items-center">
                      <ChevronRight className="h-3 w-3 mr-1" />
                      High-Level Architecture
                    </div>
                    <div className="text-xs text-gray-500 hover:text-blue-600 cursor-pointer transition-colors flex items-center">
                      <ChevronRight className="h-3 w-3 mr-1" />
                      Core Library Structure
                    </div>
                    <div className="text-xs text-gray-500 hover:text-blue-600 cursor-pointer transition-colors flex items-center">
                      <ChevronRight className="h-3 w-3 mr-1" />
                      Auto-Loading System Architecture
                    </div>
                    <div className="text-xs text-gray-500 hover:text-blue-600 cursor-pointer transition-colors flex items-center">
                      <ChevronRight className="h-3 w-3 mr-1" />
                      Key Design Patterns
                    </div>
                    <div className="text-xs text-gray-500 hover:text-blue-600 cursor-pointer transition-colors flex items-center">
                      <ChevronRight className="h-3 w-3 mr-1" />
                      Lazy Loading and Import Structure
                    </div>
                    <div className="text-xs text-gray-500 hover:text-blue-600 cursor-pointer transition-colors flex items-center">
                      <ChevronRight className="h-3 w-3 mr-1" />
                      Configuration-Driven Architecture
                    </div>
                    <div className="text-xs text-gray-500 hover:text-blue-600 cursor-pointer transition-colors flex items-center">
                      <ChevronRight className="h-3 w-3 mr-1" />
                      Multi-Framework Abstraction
                    </div>
                    <div className="text-xs text-gray-500 hover:text-blue-600 cursor-pointer transition-colors flex items-center">
                      <ChevronRight className="h-3 w-3 mr-1" />
                      Model Ecosystem Overview
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Quick Stats */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-800">Research Stats</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Models Analyzed</span>
                      <Badge variant="secondary" className="text-xs">5000+</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Frameworks</span>
                      <Badge variant="secondary" className="text-xs">3</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Last Updated</span>
                      <Badge variant="secondary" className="text-xs">Jun 2025</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}