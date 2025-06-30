"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UploadFormDialogContent } from '@/components/upload-form-dialog-content';
import { 
  Upload, 
  Shield, 
  BookOpen,
  Sparkles,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

export default function TestUploadPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 to-background p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 rounded-xl bg-primary/10">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Academic Paper Upload</h1>
          </div>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            Upload your academic paper to process with AI-powered insights on{' '}
            <a 
              href="https://mdscholar.net" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              mdscholar.net
              <ExternalLink className="h-4 w-4" />
            </a>
          </p>
        </div>

        {/* Main Upload Card */}
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-8">
            <CardTitle className="flex items-center gap-3 text-3xl text-foreground">
              <Sparkles className="h-8 w-8 text-primary" />
              Ready to Upload?
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Click the button below to start the secure upload process
            </CardDescription>
          </CardHeader>
          <CardContent className="p-12">
            <div className="text-center space-y-8">
              <div className="p-8 rounded-2xl bg-primary/5 border-2 border-dashed border-primary/20">
                <div className="p-6 rounded-full bg-primary/10 w-fit mx-auto mb-6">
                  <Upload className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Upload Academic Paper</h3>
                <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                  Secure three-step process: email verification, security check, and file upload
                </p>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105">
                      <Upload className="h-5 w-5 mr-3" />
                      Start Upload Process
                      <ArrowRight className="h-5 w-5 ml-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <UploadFormDialogContent onClose={handleCloseDialog} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-xl bg-card backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-4 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">Secure Upload</h3>
            <p className="text-muted-foreground">
              Protected by Cloudflare Turnstile and encrypted transfer
            </p>
          </div>
          <div className="text-center p-6 rounded-xl bg-card backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-4 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">AI Processing</h3>
            <p className="text-muted-foreground">
              Advanced analysis and insights on mdscholar.net
            </p>
          </div>
          <div className="text-center p-6 rounded-xl bg-card backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-4 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">Academic Focus</h3>
            <p className="text-muted-foreground">
              Optimized for research papers and academic content
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}