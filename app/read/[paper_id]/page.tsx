"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { MermaidDiagram } from '@/components/mermaid-diagram';
import { 
  BookOpen, 
  ArrowLeft,
  Search,
  RefreshCw,
  Mail,
  ChevronRight,
  ChevronDown,
  Layers,
  Brain,
  Target,
  Download,
  Share,
  Bookmark,
  MessageSquare,
  AlertCircle,
  FileText,
  Calendar,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase, type Paper, type Topic, type Subtopic } from '@/lib/supabase';

export async function generateStaticParams() {
  try {
    // Fetch all paper IDs from Supabase to generate static routes
    const { data: papers, error } = await supabase
      .from('papers')
      .select('id');
    
    if (error) {
      console.error('Error fetching papers for static generation:', error);
      // Return empty array to avoid build failure
      return [];
    }
    
    // Return array of paper_id objects for static generation
    return papers?.map((paper) => ({
      paper_id: paper.id.toString()
    })) || [];
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    // Return empty array to avoid build failure
    return [];
  }
}

interface TopicItem {
  id: string;
  title: string;
  isExpanded?: boolean;
  children?: TopicItem[];
}

export default function ReadPage() {
  const params = useParams();
  const paperId = params.paper_id as string;
  
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('');
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  
  // Paper data state
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
    fetchPaper();
  }, [paperId]);

  const fetchPaper = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('papers')
        .select('*')
        .eq('id', paperId)
        .single();

      if (supabaseError) {
        throw supabaseError;
      }

      if (!data) {
        throw new Error('Paper not found');
      }

      setPaper(data);
      
      // Set default selections
      if (data.topics && data.topics.length > 0) {
        const firstTopicId = `topic-0`;
        setSelectedTopic(firstTopicId);
        setExpandedTopics(new Set([firstTopicId]));
        
        if (data.topics[0].subtopics && data.topics[0].subtopics.length > 0) {
          setSelectedSubtopic(`${firstTopicId}-subtopic-0`);
        }
      }
    } catch (err) {
      console.error('Error fetching paper:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch paper');
    } finally {
      setLoading(false);
    }
  };

  // Generate topics structure for navigation
  const topics: TopicItem[] = paper?.topics.map((topic, topicIndex) => ({
    id: `topic-${topicIndex}`,
    title: topic.topic,
    children: topic.subtopics.map((subtopic, subtopicIndex) => ({
      id: `topic-${topicIndex}-subtopic-${subtopicIndex}`,
      title: subtopic.subtopic_title
    }))
  })) || [];

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
              // Auto-select first subtopic
              if (topic.children.length > 0) {
                setSelectedSubtopic(topic.children[0].id);
              }
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
            {topic.children.map((child) => (
              <div
                key={child.id}
                className={`flex items-center py-2 px-3 ml-6 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                  selectedSubtopic === child.id ? 'bg-green-50 border-l-4 border-green-500 text-green-700' : 'text-gray-600'
                }`}
                onClick={() => setSelectedSubtopic(child.id)}
              >
                <span className="text-sm">{child.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  // Get current content based on selection
  const getCurrentContent = () => {
    if (!paper || !selectedSubtopic) return null;
    
    const [, topicIndex, , subtopicIndex] = selectedSubtopic.split('-').map(Number);
    const topic = paper.topics[topicIndex];
    const subtopic = topic?.subtopics[subtopicIndex];
    
    return { topic, subtopic };
  };

  const currentContent = getCurrentContent();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar Skeleton */}
            <div className="col-span-3">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-20" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Content Skeleton */}
            <div className="col-span-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                  <Skeleton className="h-48 w-full" />
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar Skeleton */}
            <div className="col-span-3">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent className="space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              Error Loading Paper
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="flex space-x-3">
              <Button onClick={fetchPaper} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-700">
              <FileText className="h-5 w-5 mr-2" />
              Paper Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              The paper with ID "{paperId}" could not be found.
            </p>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </CardContent>
        </Card>
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
              <span className="text-sm text-gray-600">Paper #{paperId}</span>
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
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Layers className="h-5 w-5 mr-2" />
                  Topics
                </CardTitle>
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
                      {currentContent?.subtopic?.subtopic_title || 'Select a topic to begin'}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(paper.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                  {currentContent?.topic && (
                    <p className="text-sm text-gray-600">
                      From: <span className="font-medium">{currentContent.topic.topic}</span>
                    </p>
                  )}
                </CardHeader>
                
                {currentContent?.subtopic && (
                  <CardContent className="space-y-6">
                    {/* Content */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-600" />
                        Content
                      </h3>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {currentContent.subtopic.content}
                        </p>
                      </div>
                    </div>

                    {/* Mermaid Diagram */}
                    {currentContent.subtopic.mermaid && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                            <Target className="h-5 w-5 mr-2 text-purple-600" />
                            Visual Diagram
                          </h3>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <MermaidDiagram 
                              diagram={currentContent.subtopic.mermaid}
                              className="w-full"
                              onError={(error) => console.error('Mermaid error:', error)}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* AI Research Insights */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-start space-x-3">
                        <Brain className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-2">AI Research Insights</h4>
                          <p className="text-blue-800 text-sm">
                            Ask questions about this content for deeper analysis and implementation guidance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
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
                <CardTitle className="text-lg font-semibold text-gray-900">Paper Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Paper Stats */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-800">Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Total Topics</span>
                      <Badge variant="secondary" className="text-xs">{paper.topics.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Total Subtopics</span>
                      <Badge variant="secondary" className="text-xs">
                        {paper.topics.reduce((acc, topic) => acc + topic.subtopics.length, 0)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Diagrams</span>
                      <Badge variant="secondary" className="text-xs">
                        {paper.topics.reduce((acc, topic) => 
                          acc + topic.subtopics.filter(sub => sub.mermaid).length, 0)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Navigation */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-800">Quick Navigation</h4>
                  <div className="space-y-1">
                    {paper.topics.slice(0, 5).map((topic, index) => (
                      <div 
                        key={index}
                        className="text-xs text-gray-500 hover:text-blue-600 cursor-pointer transition-colors flex items-center"
                        onClick={() => {
                          const topicId = `topic-${index}`;
                          setSelectedTopic(topicId);
                          setExpandedTopics(new Set([topicId]));
                          if (topic.subtopics.length > 0) {
                            setSelectedSubtopic(`${topicId}-subtopic-0`);
                          }
                        }}
                      >
                        <ChevronRight className="h-3 w-3 mr-1" />
                        {topic.topic}
                      </div>
                    ))}
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