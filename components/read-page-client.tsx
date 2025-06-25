"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createClient } from '@supabase/supabase-js';
import { MermaidDiagram } from '@/components/mermaid-diagram';
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface TopicItem {
  id: string;
  title: string;
  isExpanded?: boolean;
  children?: TopicItem[];
}

interface Subtopic {
  content: string;
  mermaid: string;
  subtopic_title: string;
}

interface Topic {
  topic: string;
  subtopics: Subtopic[];
}

interface Paper {
  id: number;
  created_at: string;
  topics: Topic[];
}

interface ReadPageClientProps {
  paperId: string;
  initialPaper: Paper | null;
  initialError: string | null;
}

export function ReadPageClient({ paperId, initialPaper, initialError }: ReadPageClientProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [paper, setPaper] = useState<Paper | null>(initialPaper);
  const [selectedTopic, setSelectedTopic] = useState<string>('overview');
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set(['overview']));
  const [loading, setLoading] = useState(!initialPaper && !initialError);
  const [error, setError] = useState<string | null>(initialError);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fetchPaper = useCallback(async () => {
    if (initialPaper) return; // Don't refetch if we have initial data

    try {
      setLoading(true);
      setError(null);

      const { data: paperData, error: fetchError } = await supabase
        .from('papers')
        .select('*')
        .eq('id', paperId)
        .single();

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setPaper(paperData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [paperId, initialPaper]);

  useEffect(() => {
    fetchPaper();
  }, [fetchPaper]);

  // Build topics tree from paper data
  const buildTopicsTree = (): TopicItem[] => {
    if (!paper?.topics) return [];

    const topicsTree: TopicItem[] = [];

    paper.topics.forEach((topic, topicIndex) => {
      const topicId = `topic-${topicIndex}`;
      const topicItem: TopicItem = {
        id: topicId,
        title: topic.topic,
        children: topic.subtopics.map((subtopic, subtopicIndex) => ({
          id: `${topicId}-subtopic-${subtopicIndex}`,
          title: subtopic.subtopic_title,
        }))
      };
      topicsTree.push(topicItem);
    });

    return topicsTree;
  };

  const topics = buildTopicsTree();

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

  const getCurrentContent = () => {
    if (!paper?.topics) return null;

    // Parse selectedTopic to get topic and subtopic indices
    if (selectedTopic.startsWith('topic-')) {
      const parts = selectedTopic.split('-');
      const topicIndex = parseInt(parts[1]);
      
      if (parts.length === 2) {
        // Main topic selected
        const topic = paper.topics[topicIndex];
        return {
          title: topic.topic,
          content: `This topic contains ${topic.subtopics.length} subtopics. Select a subtopic to view its content.`,
          mermaid: null
        };
      } else if (parts.length === 4 && parts[2] === 'subtopic') {
        // Subtopic selected
        const subtopicIndex = parseInt(parts[3]);
        const topic = paper.topics[topicIndex];
        const subtopic = topic.subtopics[subtopicIndex];
        
        return {
          title: subtopic.subtopic_title,
          content: subtopic.content,
          mermaid: subtopic.mermaid
        };
      }
    }

    return {
      title: 'Overview',
      content: `This paper contains ${paper.topics.length} main topics. Navigate through the topics in the sidebar to explore the content.`,
      mermaid: null
    };
  };

  const currentContent = getCurrentContent();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading paper...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Paper</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchPaper} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Paper not found</p>
        </div>
      </div>
    );
  }

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
              <span className="text-sm text-gray-600">Paper ID: {paperId}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="text-xs" onClick={fetchPaper}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
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
              {/* Content Section */}
              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {currentContent?.title}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      Last indexed: {new Date(paper.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {currentContent?.content}
                    </p>
                  </div>

                  {/* Mermaid Diagram */}
                  {currentContent?.mermaid && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                          Diagram
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <MermaidDiagram 
                            diagram={currentContent.mermaid}
                            className="w-full min-h-[300px]"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Research Insights */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <Brain className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">AI Research Insights</h4>
                        <p className="text-blue-800 text-sm">
                          Ask Devin about this paper for deeper analysis and implementation guidance.
                        </p>
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
                  {paper.topics.map((topic, index) => (
                    <div key={index} className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">
                      {topic.topic}
                      <div className="ml-3 space-y-1 mt-1">
                        {topic.subtopics.map((subtopic, subIndex) => (
                          <div key={subIndex} className="text-xs text-gray-500 hover:text-blue-600 cursor-pointer transition-colors flex items-center">
                            <ChevronRight className="h-3 w-3 mr-1" />
                            {subtopic.subtopic_title}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Quick Stats */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-800">Paper Stats</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Topics</span>
                      <Badge variant="secondary" className="text-xs">{paper.topics.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Subtopics</span>
                      <Badge variant="secondary" className="text-xs">
                        {paper.topics.reduce((acc, topic) => acc + topic.subtopics.length, 0)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Created</span>
                      <Badge variant="secondary" className="text-xs">
                        {new Date(paper.created_at).toLocaleDateString()}
                      </Badge>
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