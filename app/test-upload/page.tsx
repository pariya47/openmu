"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  ExternalLink,
  BookOpen,
  Sparkles,
  Shield,
  Zap,
  ArrowRight
} from 'lucide-react';
import { UploadFormDialogContent } from '@/components/upload-form-dialog-content';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  path: string;
  uploadedAt: Date;
}

export default function TestUploadPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUploadSuccess = (file: UploadedFile, email: string) => {
    setUploadedFile(file);
    setUserEmail(email);
    setSuccess(`Academic paper "${file.name}" uploaded successfully!`);
    setError(null);
    setIsDialogOpen(false);
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccess(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setUserEmail('');
    setSuccess(null);
    setError(null);
  };

  const processOnMdscholar = () => {
    if (uploadedFile && userEmail) {
      window.open(
        `https://mdscholar.net?file=${encodeURIComponent(uploadedFile.path)}&email=${encodeURIComponent(userEmail)}`, 
        '_blank'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-primary/10">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
              Academic Paper Upload
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your research paper and process it with AI-powered insights on{' '}
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

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Section */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Upload Your Paper</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Secure upload with email verification
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              {!uploadedFile ? (
                <div className="text-center space-y-6">
                  <div className="p-8 border-2 border-dashed border-muted rounded-xl bg-muted/20">
                    <div className="space-y-4">
                      <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
                        <FileText className="h-12 w-12 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Ready to Upload</h3>
                        <p className="text-muted-foreground mb-4">
                          Click below to start the secure upload process
                        </p>
                        <div className="inline-flex items-center gap-2 bg-background px-4 py-2 rounded-lg border">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm font-medium">PDF, DOC, DOCX (max 25MB)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                        <Upload className="h-5 w-5 mr-3" />
                        Upload Academic Paper
                        <ArrowRight className="h-5 w-5 ml-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                          <Sparkles className="h-5 w-5 text-primary" />
                          Upload Academic Paper
                        </DialogTitle>
                        <DialogDescription className="text-base">
                          Complete the steps below to securely upload your research paper
                        </DialogDescription>
                      </DialogHeader>
                      <UploadFormDialogContent 
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={handleUploadError}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Upload Complete!</span>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-green-800 dark:text-green-200 truncate">
                          {uploadedFile.name}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-green-600 dark:text-green-400 mt-1">
                          <span>{formatFileSize(uploadedFile.size)}</span>
                          <span>•</span>
                          <span>{uploadedFile.uploadedAt.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <Button 
                      onClick={processOnMdscholar}
                      size="lg"
                      className="w-full text-lg py-6"
                    >
                      <ExternalLink className="h-5 w-5 mr-3" />
                      Process on mdscholar.net
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={resetUpload}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Another Paper
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features & Info Section */}
          <div className="space-y-6">
            {/* Features Card */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Why Choose Our Platform
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Secure Upload</h3>
                    <p className="text-sm text-muted-foreground">
                      Protected by Cloudflare Turnstile and email verification
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">AI-Powered Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Advanced processing and insights generation
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Academic Focus</h3>
                    <p className="text-sm text-muted-foreground">
                      Optimized specifically for research papers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Messages */}
            {success && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Supported Formats */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg">Supported Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <FileText className="h-6 w-6 mx-auto mb-2 text-red-500" />
                    <span className="text-sm font-medium">PDF</span>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <FileText className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                    <span className="text-sm font-medium">DOC</span>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <FileText className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <span className="text-sm font-medium">DOCX</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Maximum file size: 25MB
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}