"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Search, 
  Plus, 
  Calendar,
  User,
  FileText,
  ExternalLink,
  BookOpen,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createClient } from '@/lib/supabase/client';

interface Author {
  name: string;
}

interface Paper {
  id: number;
  paper_name: string | null;
  authers: any | null;
  abstract: string | null;
  public_date: string | null;
  url: string | null;
  created_at: string;
}

export function PaperDashboard() {
  const router = useRouter();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch papers from Supabase
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('papers')
          .select('id, paper_name, authers, abstract, public_date, url, created_at')
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        setPapers(data || []);
      } catch (err) {
        console.error('Error fetching papers:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch papers');
        toast.error('Failed to load papers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  // Helper function to normalize authors data
  const normalizeAuthors = (authers: any): string[] => {
    if (!authers || typeof authers !== 'object') return [];
    
    if (authers.name && Array.isArray(authers.name)) {
      return authers.name.filter((n: any) => typeof n === 'string');
    }
    
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

  // Filter papers based on search query
  const filteredPapers = papers.filter(paper => {
    const searchLower = searchQuery.toLowerCase();
    
    const paperName = paper.paper_name?.toLowerCase() || '';
    const abstract = paper.abstract?.toLowerCase() || '';
    
    const normalizedAuthors = normalizeAuthors(paper.authers);
    const authors = normalizedAuthors.join(' ').toLowerCase();
    
    return (
      paperName.includes(searchLower) || 
      abstract.includes(searchLower) || 
      authors.includes(searchLower)
    );
  });

  const handlePaperClick = (paper: Paper) => {
    setSelectedPaper(paper);
    setIsModalOpen(true);
  };

  const handleAddPaper = () => {
    router.push('/test-upload');
  };

  const handleViewFullPaper = (paperId: number) => {
    router.push(`/doc-viewer/${paperId}`);
  };

  const formatAuthors = (authers: any) => {
    const normalizedAuthors = normalizeAuthors(authers);
    if (normalizedAuthors.length === 0) return 'Unknown Author';
    if (normalizedAuthors.length <= 2) {
      return normalizedAuthors.join(', ');
    }
    return `${normalizedAuthors[0]} et al.`;
  };

  const truncateAbstract = (abstract: string | null, maxLength: number = 80) => {
    if (!abstract) return 'No abstract available';
    if (abstract.length <= maxLength) return abstract;
    return abstract.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  const handleCopyReference = () => {
    const textToCopy = selectedPaper?.paper_name || selectedPaper?.url || '';
    navigator.clipboard.writeText(textToCopy);
    toast.success('Reference copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-16 max-w-6xl">
        {/* Main Header */}
        <div className="text-center mb-12 mt-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight">
            Your research library,{' '}
            <span className="text-muted-foreground">
              all in one place
            </span>
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Discover, organize, and explore research papers with intelligent insights
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by title, author, or abstract..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-4 text-base border-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              aria-label="Search papers by title, author, or abstract"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading papers...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center max-w-md">
              <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Papers</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Papers Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {/* Add Paper Card */}
            <Card 
              className="group cursor-pointer border-2 border-dashed border-border bg-muted/30 hover:border-primary hover:shadow-lg transition-all duration-200 hover:scale-105 rounded-xl min-h-[210px] flex items-center justify-center"
              onClick={handleAddPaper}
            >
              <CardContent className="text-center p-4">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Plus className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">Add Paper</h3>
                <p className="text-muted-foreground text-sm">Import a new research paper to your library</p>
              </CardContent>
            </Card>

            {/* Paper Cards */}
            {filteredPapers.map((paper) => (
              <Card
                key={paper.id}
                className="group cursor-pointer border-2 border-border bg-card hover:shadow-lg transition-all duration-200 hover:scale-105 rounded-xl overflow-hidden min-h-[210px] flex flex-col"
                onClick={() => handlePaperClick(paper)}
              >
                <CardHeader className="pb-1 flex-shrink-0">
                  <div className="flex items-start justify-between mb-1">
                    <Badge variant="secondary" className="text-xs font-medium">
                      {paper.public_date ? formatDate(paper.public_date) : formatDate(paper.created_at)}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    {paper.paper_name || 'Untitled Paper'}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {formatAuthors(paper.authers)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                    {truncateAbstract(paper.abstract)}
                  </p>
                  
                  <div className="flex items-end justify-between mt-auto">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Added {formatDate(paper.created_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPapers.length === 0 && papers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center border-2 border-border">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No papers yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto text-sm mb-6">
              Start building your research library by adding your first paper
            </p>
            <Button 
              onClick={handleAddPaper}
              className="shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Paper
            </Button>
          </div>
        )}

        {/* Search Empty State */}
        {!loading && !error && filteredPapers.length === 0 && papers.length > 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center border-2 border-border">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No papers found</h3>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Try adjusting your search terms or add new papers to your library
            </p>
          </div>
        )}

        {/* Paper Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border-2 shadow-xl">
            <DialogHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <DialogTitle className="text-xl font-bold text-foreground leading-tight mb-2">
                    {selectedPaper?.paper_name || 'Untitled Paper'}
                  </DialogTitle>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{selectedPaper?.public_date ? formatDate(selectedPaper.public_date) : formatDate(selectedPaper?.created_at || '')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{formatAuthors(selectedPaper?.authers || null)}</span>
                    </div>
                    {selectedPaper?.url && (
                      <div className="flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" />
                        <a 
                          href={selectedPaper.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 underline"
                        >
                          Original Paper
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <Separator />
              
              <div>
                <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Abstract
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {selectedPaper?.abstract || 'No abstract available for this paper.'}
                </p>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="default"
                  className="flex-1 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 rounded-lg"
                  onClick={() => {
                    if (selectedPaper) {
                      handleViewFullPaper(selectedPaper.id);
                      setIsModalOpen(false);
                    }
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Analysis
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  className="flex-1 rounded-lg transition-all duration-200"
                  onClick={handleCopyReference}
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