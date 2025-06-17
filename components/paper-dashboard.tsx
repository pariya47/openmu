"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Plus, 
  Calendar,
  User,
  FileText,
  ExternalLink,
  X,
  Sparkles,
  BookOpen,
  Clock
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

interface Paper {
  id: string;
  title: string;
  year: number;
  authors: string[];
  abstract: string;
  doi?: string;
  fullPaperUrl?: string;
  dateAdded: string;
}

const samplePapers: Paper[] = [
  {
    id: '1',
    title: 'Attention Is All You Need',
    year: 2017,
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar'],
    abstract: 'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable.',
    doi: '10.48550/arXiv.1706.03762',
    fullPaperUrl: '#',
    dateAdded: '2024-01-15'
  },
  {
    id: '2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    year: 2018,
    authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee'],
    abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations.',
    doi: '10.48550/arXiv.1810.04805',
    fullPaperUrl: '#',
    dateAdded: '2024-01-14'
  },
  {
    id: '3',
    title: 'Language Models are Few-Shot Learners',
    year: 2020,
    authors: ['Tom B. Brown', 'Benjamin Mann', 'Nick Ryder'],
    abstract: 'Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. While typically task-agnostic in architecture, this method still requires task-specific fine-tuning datasets.',
    doi: '10.48550/arXiv.2005.14165',
    fullPaperUrl: '#',
    dateAdded: '2024-01-13'
  },
  {
    id: '4',
    title: 'Deep Residual Learning for Image Recognition',
    year: 2015,
    authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren'],
    abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions.',
    doi: '10.1109/CVPR.2016.90',
    fullPaperUrl: '#',
    dateAdded: '2024-01-12'
  },
  {
    id: '5',
    title: 'Generative Adversarial Networks',
    year: 2014,
    authors: ['Ian J. Goodfellow', 'Jean Pouget-Abadie', 'Mehdi Mirza'],
    abstract: 'We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability.',
    doi: '10.48550/arXiv.1406.2661',
    fullPaperUrl: '#',
    dateAdded: '2024-01-11'
  }
];

export function PaperDashboard() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load papers from localStorage on component mount
  useEffect(() => {
    const savedPapers = localStorage.getItem('research-papers');
    if (savedPapers) {
      setPapers(JSON.parse(savedPapers));
    } else {
      // Initialize with sample papers
      setPapers(samplePapers);
      localStorage.setItem('research-papers', JSON.stringify(samplePapers));
    }
  }, []);

  // Save papers to localStorage whenever papers change
  useEffect(() => {
    if (papers.length > 0) {
      localStorage.setItem('research-papers', JSON.stringify(papers));
    }
  }, [papers]);

  // Filter papers based on search query
  const filteredPapers = papers.filter(paper =>
    paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
    paper.doi?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePaperClick = (paper: Paper) => {
    setSelectedPaper(paper);
    setIsModalOpen(true);
  };

  const handleAddPaper = () => {
    // For now, just show an alert - in a real app this would open an add paper form
    alert('Add Paper functionality would be implemented here');
  };

  const handleAISearch = () => {
    // For now, just show an alert - in a real app this would trigger AI search
    alert('AI Search functionality would be implemented here');
  };

  const formatAuthors = (authors: string[]) => {
    if (authors.length <= 2) {
      return authors.join(', ');
    }
    return `${authors[0]} et al.`;
  };

  const truncateAbstract = (abstract: string, maxLength: number = 100) => {
    if (abstract.length <= maxLength) return abstract;
    return abstract.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-10 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3 leading-tight">
            Your summarized research library,{' '}
            <span className="text-slate-600">
              all in one place
            </span>
          </h1>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Discover, organize, and explore research papers with intelligent insights
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by DOI, Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-4 text-base border-2 border-slate-300 rounded-xl focus:border-slate-400 focus:ring-slate-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
              />
            </div>
            <Button
              onClick={handleAISearch}
              size="default"
              className="px-6 py-4 text-base rounded-xl bg-slate-600 hover:bg-slate-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Search
            </Button>
          </div>
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {/* Add Paper Card */}
          <Card 
            className="group cursor-pointer border-2 border-dashed border-slate-300 bg-slate-50 hover:border-slate-400 hover:shadow-lg transition-all duration-200 hover:scale-105 rounded-xl min-h-[240px] flex items-center justify-center"
            onClick={handleAddPaper}
          >
            <CardContent className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Add Paper</h3>
              <p className="text-slate-500 text-sm">Import a new research paper to your library</p>
            </CardContent>
          </Card>

          {/* Paper Cards */}
          {filteredPapers.map((paper) => (
            <Card
              key={paper.id}
              className="group cursor-pointer border-2 border-slate-300 bg-slate-50 hover:shadow-lg transition-all duration-200 hover:scale-105 rounded-xl overflow-hidden"
              onClick={() => handlePaperClick(paper)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-xs font-medium bg-slate-200 text-slate-700 border border-slate-300">
                    {paper.year}
                  </Badge>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <CardTitle className="text-base font-bold text-slate-800 leading-tight line-clamp-2 group-hover:text-slate-600 transition-colors duration-200">
                  {paper.title}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {formatAuthors(paper.authors)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {truncateAbstract(paper.abstract)}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    Added {new Date(paper.dateAdded).toLocaleDateString()}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-slate-600 hover:text-slate-700 hover:bg-slate-100 text-xs"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredPapers.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200">
              <Search className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No papers found</h3>
            <p className="text-slate-500 max-w-md mx-auto text-sm">
              Try adjusting your search terms or add new papers to your library
            </p>
          </div>
        )}

        {/* Paper Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border-2 border-slate-300 shadow-xl bg-white">
            <DialogHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <DialogTitle className="text-xl font-bold text-slate-800 leading-tight mb-2">
                    {selectedPaper?.title}
                  </DialogTitle>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{selectedPaper?.year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{selectedPaper?.authors.join(', ')}</span>
                    </div>
                    {selectedPaper?.doi && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span className="font-mono text-xs">{selectedPaper.doi}</span>
                      </div>
                    )}
                  </div>
                </div>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-slate-100 flex-shrink-0 border border-slate-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <Separator className="bg-slate-300" />
              
              <div>
                <h3 className="text-base font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Abstract
                </h3>
                <p className="text-slate-700 leading-relaxed text-sm">
                  {selectedPaper?.abstract}
                </p>
              </div>

              <Separator className="bg-slate-300" />

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="default"
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 rounded-lg"
                  onClick={() => {
                    if (selectedPaper?.fullPaperUrl) {
                      window.open(selectedPaper.fullPaperUrl, '_blank');
                    }
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Full Paper
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  className="flex-1 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-lg transition-all duration-200"
                  onClick={() => {
                    // Copy DOI or title to clipboard
                    const textToCopy = selectedPaper?.doi || selectedPaper?.title || '';
                    navigator.clipboard.writeText(textToCopy);
                    // In a real app, you'd show a toast notification here
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Copy Reference
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}