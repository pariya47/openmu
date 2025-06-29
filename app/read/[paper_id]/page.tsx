"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Layers // Icon for Topics
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Paper, Topic as PaperTopic, Subtopic as PaperSubtopic } from '@/types/paper'; // Renamed to avoid conflict
import { MermaidDiagram } from '@/components/mermaid-diagram';

// Interface for sidebar topic items (can be different from PaperTopic)
interface SidebarTopicItem {
  id: string;
  title: string;
  // children?: SidebarTopicItem[]; // Keeping it simple for now
}

export default function ReadPaperPage({ params }: { params: { paper_id: string } }) {
  const { paper_id } = params; // Directly from props for server component like dynamic pages

  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // For sidebar, if we decide to make it interactive
  const [selectedSidebarTopic, setSelectedSidebarTopic] = useState<string | null>(null);
  const [expandedSidebarTopics, setExpandedSidebarTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (paper_id) {
      const fetchPaper = async () => {
        setLoading(true);
        setError(null);
        setPaper(null);

        const supabase = createClient();
        const { data, error: dbError } = await supabase
          .from('papers')
          .select('id, topics, created_at')
          .eq('id', paper_id)
          .single();

        if (dbError) {
          console.error('Error fetching paper:', dbError);
          setError(`Failed to load paper: ${dbError.message}`);
        } else if (data) {
          setPaper(data as Paper);
          if (data.topics && (data.topics as PaperTopic[]).length > 0) {
            // Optionally set the first topic as selected or expand it
            // setSelectedSidebarTopic((data.topics as PaperTopic[])[0].topic);
          }
        } else {
          setError('Paper not found.');
        }
        setLoading(false);
      };
      fetchPaper();
    } else {
      setError('No paper ID provided.');
      setLoading(false);
    }
  }, [paper_id]);

  useEffect(() => {
    if (paper) {
      document.title = `SUMU - ${paper.topics[0]?.topic || `Paper ${paper.id}`}`;
    } else if (error) {
      document.title = `SUMU - Error`;
    } else {
      document.title = `SUMU - Loading Paper...`;
    }
  }, [paper, error]);


  const toggleSidebarTopic = (topicId: string) => {
    const newExpanded = new Set(expandedSidebarTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedSidebarTopics(newExpanded);
  };

  const renderSidebarTopicTree = (sidebarTopics: SidebarTopicItem[], level = 0) => {
    return sidebarTopics.map((topic) => (
      <div key={topic.id} className={`${level > 0 ? 'ml-4' : ''}`}>
        <a // Changed to <a> for potential scroll navigation
          href={`#topic-${topic.id.replace(/\s+/g, '-')}`} // Create a scrollable ID
          className={`flex items-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
            selectedSidebarTopic === topic.id ? 'bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
          }`}
          onClick={(e) => {
            e.preventDefault(); // Prevent default anchor behavior
            setSelectedSidebarTopic(topic.id);
            // Scroll to section
            const element = document.getElementById(`topic-${topic.id.replace(/\s+/g, '-')}`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // if (topic.children) { // If we add children to sidebar items
            //   toggleSidebarTopic(topic.id);
            // }
          }}
        >
          {/* {topic.children && ( // If we add children
            <div className="mr-2">
              {expandedSidebarTopics.has(topic.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )} */}
          <span className={`text-sm ${level === 0 ? 'font-medium' : 'font-normal'}`}>
            {topic.title}
          </span>
        </a>
        {/* {topic.children && expandedSidebarTopics.has(topic.id) && ( // If we add children
          <div className="mt-1">
            {renderSidebarTopicTree(topic.children, level + 1)}
          </div>
        )} */}
      </div>
    ));
  };

  const sidebarTopicsList: SidebarTopicItem[] = paper?.topics.map(t => ({ id: t.topic, title: t.topic })) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Sidebar - Topics */}
          <div className="md:col-span-3">
            <Card className="sticky top-24 max-h-[calc(100vh-8rem)] bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Layers className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" /> Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-12rem)]">
                  <div className="px-4 pb-4">
                    {loading && (
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    )}
                    {!loading && error && <p className="text-red-500 p-2 text-sm">Error loading topics.</p>}
                    {!loading && !error && paper && sidebarTopicsList.length > 0 && renderSidebarTopicTree(sidebarTopicsList)}
                    {!loading && !error && paper && sidebarTopicsList.length === 0 && <p className="text-gray-500 p-2 text-sm">No topics found for this paper.</p>}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-9 lg:col-span-6"> {/* Adjusted grid span for better layout */}
            {loading && (
              <div className="space-y-6">
                <Card className="shadow-sm bg-white dark:bg-gray-800">
                  <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/4 mt-2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </CardContent>
                </Card>
                 <Card className="shadow-sm bg-white dark:bg-gray-800">
                  <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              </div>
            )}

            {error && (
              <Card className="shadow-sm bg-white dark:bg-gray-800 border-red-500 dark:border-red-400">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" /> Error
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-500 dark:text-red-300">{error}</p>
                  <Link href="/" className="mt-4 inline-block">
                    <Button variant="outline">Go back to Home</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {!loading && !error && paper && (
              <div className="space-y-8">
                <Card className="shadow-sm bg-white dark:bg-gray-800">
                  <CardHeader>
                      <CardTitle className="text-3xl font-bold">
                        {paper.topics[0]?.topic || `Paper ID: ${paper.id}`}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1">
                        Created: {new Date(paper.created_at || Date.now()).toLocaleDateString()}
                      </Badge>
                  </CardHeader>
                  <CardContent>
                     <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Displaying content for paper ID: {paper.id}.
                     </p>
                  </CardContent>
                </Card>

                {paper.topics.map((topic, topicIndex) => (
                  <Card key={topicIndex} id={`topic-${topic.topic.replace(/\s+/g, '-')}`} className="shadow-sm bg-white dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle className="text-2xl font-semibold flex items-center">
                        <Target className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
                        {topic.topic}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {topic.subtopics.map((subtopic, subtopicIndex) => (
                        <div key={subtopicIndex} className="pt-4 border-t border-gray-200 dark:border-gray-700 first:border-t-0 first:pt-0">
                          <h4 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-200">{subtopic.subtopic_title}</h4>
                          {subtopic.content && (
                            <div
                              className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                              dangerouslySetInnerHTML={{ __html: subtopic.content.replace(/\n/g, '<br />') }}
                            />
                          )}
                          {subtopic.mermaid && subtopic.mermaid.trim() !== "" && (
                            <div className="mt-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-md shadow">
                              <MermaidDiagram diagram={subtopic.mermaid} />
                            </div>
                          )}
                        </div>
                      ))}
                      {topic.subtopics.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400">No subtopics available for this topic.</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
                 {paper.topics.length === 0 && (
                    <Card className="shadow-sm bg-white dark:bg-gray-800">
                        <CardContent>
                            <p className="text-gray-500 dark:text-gray-400 p-4 text-center">This paper does not have any topics defined yet.</p>
                        </CardContent>
                    </Card>
                 )}
              </div>
            )}
          </div>

          {/* Optional Right Sidebar (can be used for "On this page" for subtopics, or other metadata) */}
          {/* For now, let's keep it simple and remove the static right sidebar content */}
          <div className="hidden lg:block md:col-span-3">
             {/* Placeholder for potential future use, e.g. quick stats or related papers */}
             <Card className="sticky top-24 bg-white dark:bg-gray-800 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Paper Details</CardTitle>
                </CardHeader>
                <CardContent>
                    {paper && (
                        <div className="space-y-2 text-sm">
                            <p><strong>ID:</strong> {paper.id}</p>
                            <p><strong>Topics:</strong> {paper.topics.length}</p>
                            <p><strong>Created:</strong> {new Date(paper.created_at || Date.now()).toLocaleDateString()}</p>
                        </div>
                    )}
                     {loading && (
                       <div className="space-y-2">
                         <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-4 w-full" />
                       </div>
                     )}
                     {!loading && !paper && !error && <p className="text-gray-500">No paper loaded.</p>}
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}