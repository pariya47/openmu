"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Send,
  BookOpen,
  Calendar,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  MessageCircle,
  Sparkles,
  Clock,
  Share,
  Bookmark,
  Download,
  Settings
} from 'lucide-react';
import { mockDocSections, getDocSectionForPaper, samplePapers, type DocSection } from '@/lib/mock-data';

interface DocViewerProps {
  paperId: string;
}

export function DocViewer({ paperId }: DocViewerProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(paperId || 'overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [activeSubsection, setActiveSubsection] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');

  // Find current section - first try paper mapping, then direct section lookup
  const currentSection = getDocSectionForPaper(paperId) || 
                         mockDocSections.find(section => section.id === activeSection) || 
                         mockDocSections[0];

  // Find paper info if this is a paper-based view
  const currentPaper = samplePapers.find(paper => paper.id === paperId);
  const isPaperView = !!currentPaper;

  // Handle section navigation
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setSidebarOpen(false);
    router.push(`/doc-viewer/${sectionId}`);
  };

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
      const contextInfo = isPaperView 
        ? `the paper "${currentPaper?.title}" by ${currentPaper?.authors.join(', ')}`
        : `the ${currentSection.title} section`;
      
      setAiResponse(`Based on ${contextInfo}, here's what I found about "${aiQuery}":\n\n• This is a simulated AI response that would normally come from vector search and LLM processing\n• The system would analyze the current ${isPaperView ? 'paper' : 'section'} content and provide contextual answers\n• Real implementation would use embeddings and retrieval-augmented generation\n• Context: ${isPaperView ? 'Academic paper analysis' : 'Documentation section'}`);
      setIsAiLoading(false);
    }, 2000);
  };

  // Scroll spy effect for table of contents
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h2, h3');
      let current = '';
      
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          current = heading.id;
        }
      });
      
      if (current !== activeSubsection) {
        setActiveSubsection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSubsection]);

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
      } else if (line.startsWith('```')) {
        if (line.includes('python') || line.includes('bash') || line.includes('javascript')) {
          return '<pre class="bg-slate-100 border border-slate-200 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-slate-800">';
        } else if (line === '```') {
          return '</code></pre>';
        }
        return '';
      } else if (line.startsWith('- **') && line.includes('**:')) {
        const [term, description] = line.replace('- **', '').split('**:');
        return `<li class="mb-2"><strong class="text-slate-800">${term}</strong>: ${description}</li>`;
      } else if (line.startsWith('- ')) {
        return `<li class="mb-1 text-slate-700">${line.replace('- ', '')}</li>`;
      } else if (line.trim() === '') {
        return '<br>';
      } else if (line.includes('`') && !line.startsWith('```')) {
        return `<p class="mb-4 text-slate-700 leading-relaxed">${line.replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-2 py-1 rounded text-sm">$1</code>')}</p>`;
      } else if (line.trim().length > 0 && !line.startsWith('<')) {
        return `<p class="mb-4 text-slate-700 leading-relaxed">${line}</p>`;
      }
      return line;
    }).join('\n');
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Global Navigation */}
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
            
            {/* Metadata */}
            <div className="mt-4 space-y-2">
              <div className="text-sm text-slate-600">
                <span className="font-medium">
                  {isPaperView ? currentPaper?.title : 'huggingface/transformers'}
                </span>
              </div>
              {isPaperView && (
                <div className="text-xs text-slate-500">
                  {currentPaper?.authors.join(', ')} ({currentPaper?.year})
                </div>
              )}
              <div className="flex items-center text-xs text-slate-500">
                <Clock className="h-3 w-3 mr-1" />
                Last Indexed: {isPaperView ? 'June 10, 2025 (1d)' : 'June 5, 2025 (4d/2h)'}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-1">
              {mockDocSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between group text-sm
                    ${activeSection === section.id || currentSection.id === section.id
                      ? 'bg-slate-200 text-slate-900 shadow-sm' 
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }
                  `}
                >
                  <span className="font-medium">{section.title}</span>
                  {(activeSection === section.id || currentSection.id === section.id) && (
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                  )}
                </button>
              ))}
            </nav>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="p-4 border-t border-slate-200 space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Share className="h-4 w-4 mr-2" />
              Share {isPaperView ? 'Paper' : 'Document'}
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
                  <h1 className="text-xl font-bold text-slate-900">{currentSection.title}</h1>
                  <p className="text-sm text-slate-600">
                    {isPaperView 
                      ? `${currentPaper?.authors[0]} et al. (${currentPaper?.year}) - AI-generated documentation`
                      : 'huggingface/transformers documentation'
                    }
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
            {/* Paper Abstract (if paper view) */}
            {isPaperView && currentPaper && (
              <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">Paper Abstract</h2>
                <p className="text-slate-700 leading-relaxed mb-4">{currentPaper.abstract}</p>
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {currentPaper.year}
                  </div>
                  {currentPaper.doi && (
                    <div className="flex items-center">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      DOI: {currentPaper.doi}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div 
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: parseContent(currentSection.content) }}
            />
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
                {currentSection.subsections.map((subsection) => (
                  <a
                    key={subsection.id}
                    href={`#${subsection.id}`}
                    className={`
                      block px-3 py-2 text-sm rounded-lg transition-colors duration-200
                      ${subsection.level === 2 ? 'font-medium' : 'ml-4 text-slate-600'}
                      ${activeSubsection === subsection.id 
                        ? 'bg-slate-200 text-slate-900' 
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }
                    `}
                  >
                    {subsection.title}
                  </a>
                ))}
              </nav>
            </ScrollArea>

            {/* Ad Placement */}
            <div className="p-4 border-t border-slate-200">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-xs text-blue-600 mb-2">Sponsored</div>
                <div className="text-sm font-medium text-blue-900 mb-1">AI-Powered Documentation</div>
                <div className="text-xs text-blue-700">Enhance your docs with smart search</div>
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
                placeholder={`Ask about this ${isPaperView ? 'paper' : 'documentation'}... (e.g., 'What is the main contribution?')`}
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