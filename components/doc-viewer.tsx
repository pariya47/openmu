"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  ArrowLeft,
  RefreshCw,
  Mail,
  ChevronRight,
  ChevronDown,
  Target,
  Share,
  AlertTriangle,
  Layers,
  Menu,
  X,
  Send,
  MessageCircle,
  Sparkles,
  Clock,
  Bookmark,
  Download,
  Settings
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { MermaidDiagram } from '@/components/mermaid-diagram';

// Types for the real data structure from papers table
interface Subtopic {
  subtopic_title: string;
  content: string;
  mermaid: string;
}

interface Topic {
  topic: string;
  subtopics: Subtopic[];
}

interface PaperData {
  id: number;
  paper_name: string | null;
  authers: any | null;
  abstract: string | null;
  public_date: string | null;
  url: string | null;
  topics: Topic[];
  created_at: string;
}

interface DocViewerProps {
  paperId: string;
}

export function DocViewer({ paperId }: DocViewerProps) {
  const router = useRouter();
  const [paperData, setPaperData] = useState<PaperData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');

  // Helper function to normalize authors data
  const normalizeAuthors = (authers: any): string[] => {
    if (!authers || typeof authers !== 'object') return [];
    
    // Handle the case where authers has a 'name' property that is an array
    if (authers.name && Array.isArray(authers.name)) {
      return authers.name.filter((n: any) => typeof n === 'string');
    }
    
    // Handle the case where authers is directly an array
    if (Array.isArray(authers)) {
      return authers.filter((author: any) => {
        if (typeof author === 'string') return true;
        if (typeof author === 'object' && author.name) return true;
        return false;
      }).map((author: any) => {
        if (typeof author === 'string') return author;
        return author.name;
      });
    }
    
    return [];
  };

  const formatAuthors = (authers: any) => {
    const normalizedAuthors = normalizeAuthors(authers);
    if (normalizedAuthors.length === 0) return 'Unknown Author';
    if (normalizedAuthors.length <= 2) {
      return normalizedAuthors.join(', ');
    }
    return `${normalizedAuthors[0]} et al.`;
  };

  // Fetch data from Supabase papers table
  useEffect(() => {
    const fetchPaperData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('papers')
          .select('id, paper_name, authers, abstract, public_date, url, topics, created_at')
          .eq('id', paperId)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          setPaperData(data as PaperData);
        } else {
          setError('Paper not found.');
        }
      } catch (err) {
        console.error('Error fetching paper data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch paper data');
      } finally {
        setLoading(false);
      }
    };

    if (paperId) {
      fetchPaperData();
    } else {
      setError('No paper ID provided.');
      setLoading(false);
    }
  }, [paperId]);

  // Handle back to papers
  const handleBackToPapers = () => {
    router.push('/papers');
  };

  // Handle AI query
  const handleAiQuery = async () => {
    if (!aiQuery.trim()) return;
    
    setIsAiLoading(true);
    // Simulate AI response
    setTimeout(() => {
      const currentTopic = paperData?.topics[activeTopicIndex];
      const contextInfo = currentTopic ? `the topic "${currentTopic.topic}"` : 'this content';
      const paperTitle = paperData?.paper_name || 'this paper';
      
      setAiResponse(`Based on ${contextInfo} from "${paperTitle}", here's what I found about "${aiQuery}":\n\n• This is a simulated AI response that would normally come from vector search and LLM processing\n• The system would analyze the current paper content and provide contextual answers\n• Real implementation would use embeddings and retrieval-augmented generation\n• Context: Academic paper analysis`);
      setIsAiLoading(false);
    }, 2000);
  };

  // Parse content and add IDs to headings
  const parseContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        const title = line.replace('## ', '');
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
        return `<h2 id="${id}" class="text-2xl font-bold text-slate-800 mt-8 mb-4 scroll-mt-24">${title}</h2>`;
      } else if (line.startsWith('### ')) {
        const title = line.replace('### ', '');
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
        return `<h3 id="${id}" class="text-xl font-semibold text-slate-700 mt-6 mb-3 scroll-mt-24">${title}</h3>`;
      } else if (line.startsWith('#### ')) {
        const title = line.replace('#### ', '');
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
        return `<h4 id="${id}" class="text-lg font-medium text-slate-600 mt-4 mb-2 scroll-mt-24">${title}</h4>`;
      } else if (line.startsWith('# ')) {
        const title = line.replace('# ', '');
        return `<h1 class="text-3xl font-bold text-slate-900 mb-6">${title}</h1>`;
      } else if (line.includes('**') && line.includes('**')) {
        return `<p class="mb-4 text-slate-700 leading-relaxed">${line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-800">$1</strong>')}</p>`;
      } else if (line.startsWith('<KeyFinding>') && line.includes('</KeyFinding>')) {
        const content = line.replace('<KeyFinding>', '').replace('</KeyFinding>', '');
        return `<div class="my-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg"><p class="text-blue-800 font-medium">${content}</p></div>`;
      } else if (line.startsWith('<Methodology') && line.includes('>')) {
        const titleMatch = line.match(/title="([^"]+)"/);
        const title = titleMatch ? titleMatch[1] : 'Methodology';
        return `<div class="my-4 p-4 bg-green-50 border border-green-200 rounded-lg"><h4 class="text-green-800 font-semibold mb-2">${title}</h4>`;
      } else if (line.startsWith('</Methodology>')) {
        return '</div>';
      } else if (line.startsWith('<Important>') && line.includes('</Important>')) {
        const content = line.replace('<Important>', '').replace('</Important>', '');
        return `<div class="my-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg"><p class="text-amber-800 font-medium">${content}</p></div>`;
      } else if (line.startsWith('<Insight>') && line.includes('</Insight>')) {
        const content = line.replace('<Insight>', '').replace('</Insight>', '');
        return `<div class="my-4 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg"><p class="text-purple-800 font-medium">${content}</p></div>`;
      } else if (line.startsWith('- ')) {
        return `<li class="mb-1 text-slate-700">${line.replace('- ', '')}</li>`;
      } else if (line.trim() === '') {
        return '<br>';
      } else if (line.trim().length > 0 && !line.startsWith('<')) {
        return `<p class="mb-4 text-slate-700 leading-relaxed">${line}</p>`;
      }
      return line;
    }).join('\n');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Left Sidebar - Topics */}
          <div className={`
            fixed lg:static inset-y-0 left-0 z-50 w-80 bg-slate-50 border-r border-slate-200 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleBackToPapers}
                    className="flex items-center space-x-3 group hover:scale-105 transition-all duration-200 p-2 rounded-xl hover:bg-slate-100"
                  >
                    <div className="p-2 rounded-xl bg-slate-200 group-hover:bg-slate-300 transition-colors duration-200">
                      <BookOpen className="h-5 w-5 text-slate-700" />
                    </div>
                    <span className="text-lg font-bold text-slate-800 group-hover:text-slate-600 transition-colors duration-200">
                      Doc Viewer
                    </span>
                  </button>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden p-2 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <X className="h-5 w-5 text-slate-600" />
                  </button>
                </div>
                
                {/* Paper Metadata */}
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">
                      {paperData?.paper_name || 'Loading paper...'}
                    </span>
                  </div>
                  {paperData?.authers && (
                    <div className="text-xs text-slate-500">
                      {formatAuthors(paperData.authers)}
                    </div>
                  )}
                  <div className="flex items-center text-xs text-slate-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {paperData ? `Added: ${new Date(paperData.created_at).toLocaleDateString()}` : 'Loading...'}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <ScrollArea className="flex-1 p-4">
                <nav className="space-y-1">
                  {loading && (
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  )}
                  {!loading && error && (
                    <p className="text-red-500 p-2 text-sm">Error loading topics.</p>
                  )}
                  {!loading && !error && paperData && paperData.topics && paperData.topics.map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveTopicIndex(index);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between group text-sm
                        ${activeTopicIndex === index
                          ? 'bg-slate-200 text-slate-900 shadow-sm' 
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }
                      `}
                    >
                      <span className="font-medium">{topic.topic}</span>
                      {activeTopicIndex === index && (
                        <ChevronRight className="h-4 w-4 text-slate-600" />
                      )}
                    </button>
                  ))}
                  {!loading && !error && paperData && (!paperData.topics || paperData.topics.length === 0) && (
                    <p className="text-slate-500 p-2 text-sm">No topics found for this paper.</p>
                  )}
                </nav>
              </ScrollArea>

              {/* Action Buttons */}
              <div className="p-4 border-t border-slate-200 space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Share className="h-4 w-4 mr-2" />
                  Share Paper
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex">
            <div className="flex-1 max-w-4xl">
              {/* Top Bar */}
              <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Menu className="h-5 w-5 text-slate-600" />
                    </button>
                    <div>
                      <h1 className="text-xl font-bold text-slate-900">
                        {loading ? 'Loading...' : 
                         error ? 'Error' :
                         paperData && paperData.topics && paperData.topics[activeTopicIndex] ? 
                         paperData.topics[activeTopicIndex].topic : 'No Topic'}
                      </h1>
                      <p className="text-sm text-slate-600">
                        {paperData?.paper_name || 'Loading paper data...'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Bookmark
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-8">
                {loading && (
                  <div className="space-y-6">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                )}

                {error && (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Error Loading Paper</h3>
                    <p className="text-slate-600 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                      Try Again
                    </Button>
                  </div>
                )}

                {!loading && !error && paperData && (
                  <div className="space-y-8">
                    {/* Paper Abstract (if available) */}
                    {paperData.abstract && (
                      <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                        <h2 className="text-lg font-semibold text-slate-900 mb-3">Paper Abstract</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">{paperData.abstract}</p>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          {paperData.public_date && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(paperData.public_date).toLocaleDateString()}
                            </div>
                          )}
                          {paperData.url && (
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              <a href={paperData.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Original Paper
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Topic Content */}
                    {paperData.topics && paperData.topics[activeTopicIndex] && (
                      <Card className="shadow-sm bg-white dark:bg-gray-800">
                        <CardHeader>
                          <CardTitle className="text-2xl font-semibold flex items-center">
                            <Target className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
                            {paperData.topics[activeTopicIndex].topic}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {paperData.topics[activeTopicIndex].subtopics.map((subtopic, subtopicIndex) => (
                            <div key={subtopicIndex} className="pt-4 border-t border-gray-200 dark:border-gray-700 first:border-t-0 first:pt-0">
                              <h4 className="text-xl font-medium mb-4 text-gray-800 dark:text-gray-200">
                                {subtopic.subtopic_title}
                              </h4>
                              {subtopic.content && (
                                <div
                                  className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 mb-4"
                                  dangerouslySetInnerHTML={{ __html: parseContent(subtopic.content) }}
                                />
                              )}
                              {subtopic.mermaid && subtopic.mermaid.trim() !== "" && (
                                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
                                  <MermaidDiagram diagram={subtopic.mermaid} />
                                </div>
                              )}
                            </div>
                          ))}
                          {paperData.topics[activeTopicIndex].subtopics.length === 0 && (
                            <p className="text-gray-500 dark:text-gray-400">No subtopics available for this topic.</p>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {!loading && !error && paperData && (!paperData.topics || paperData.topics.length === 0) && (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No Topics Found</h3>
                    <p className="text-slate-600">This paper doesn't contain any analyzed topics yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right TOC Panel */}
            <div className="hidden xl:block w-80 border-l border-slate-200 bg-slate-50">
              <div className="sticky top-0 h-screen flex flex-col">
                {/* TOC Header */}
                <div className="p-6 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-2">On this page</h3>
                </div>

                {/* Table of Contents */}
                <ScrollArea className="flex-1 p-4">
                  <nav className="space-y-1">
                    {!loading && !error && paperData && paperData.topics && paperData.topics[activeTopicIndex] && 
                     paperData.topics[activeTopicIndex].subtopics.map((subtopic, index) => (
                      <a
                        key={index}
                        href={`#${subtopic.subtopic_title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                        className="block px-3 py-2 text-sm rounded-lg transition-colors duration-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      >
                        {subtopic.subtopic_title}
                      </a>
                    ))}
                    {loading && (
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    )}
                  </nav>
                </ScrollArea>

                {/* Paper Details */}
                <div className="p-4 border-t border-slate-200">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-xs text-blue-600 mb-2">Paper Info</div>
                    <div className="text-sm font-medium text-blue-900 mb-1">
                      {paperData && paperData.topics ? `${paperData.topics.length} Topics` : 'Loading...'}
                    </div>
                    <div className="text-xs text-blue-700">
                      {paperData && paperData.topics && paperData.topics[activeTopicIndex] ? 
                       `${paperData.topics[activeTopicIndex].subtopics.length} Subtopics` : 
                       'Loading...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom AI Prompt Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-slate-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Sparkles className="h-4 w-4 text-slate-400" />
              </div>
              <Input
                type="text"
                placeholder="Ask about this paper... (e.g., 'What are the key findings?')"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiQuery()}
                className="pl-10 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:border-slate-400 focus:ring-slate-200 bg-white"
              />
            </div>
            <Button 
              onClick={handleAiQuery}
              disabled={isAiLoading || !aiQuery.trim()}
              className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl transition-all duration-200 hover:scale-105"
            >
              {isAiLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* AI Response */}
          {aiResponse && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-slate-200 rounded-lg">
                  <MessageCircle className="h-4 w-4 text-slate-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900 mb-2">AI Assistant</div>
                  <div className="text-sm text-slate-700 whitespace-pre-line">{aiResponse}</div>
                </div>
                <button
                  onClick={() => setAiResponse('')}
                  className="p-1 hover:bg-slate-200 rounded transition-colors"
                >
                  <X className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}