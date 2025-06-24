"use client";

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Turnstile } from '@marsidev/react-turnstile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Loader2,
  X,
  Mail,
  ExternalLink,
  BookOpen,
  Sparkles
} from 'lucide-react';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  path: string;
  uploadedAt: Date;
}

export default function TestUploadPage() {
  const [email, setEmail] = useState<string>('');
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isTurnstileSolved, setIsTurnstileSolved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    setIsEmailValid(validateEmail(email));
  }, [email]);

  const canProceed = isEmailValid && isTurnstileSolved && !isUploading && !uploadedFile;

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!canProceed) {
      if (!isEmailValid) {
        setError('Please enter a valid email address first');
      } else if (!isTurnstileSolved) {
        setError('Please complete the security verification first');
      }
      return;
    }

    setError(null);
    setSuccess(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const file = acceptedFiles[0];
      const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';

      // Simulate progress for better UX
      setUploadProgress(10);

      // Get signed upload URL
      const res = await fetch('/api/get-upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ext, turnstileToken }),
      });

      setUploadProgress(30);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to get upload URL');
      }

      const { signedUrl, path, filename } = await res.json();
      setUploadProgress(50);

      // Upload file to Supabase
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      setUploadProgress(80);

      if (!uploadRes.ok) {
        throw new Error('Failed to upload file');
      }

      setUploadProgress(100);

      // Set uploaded file
      const uploadedFile: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        path: path,
        uploadedAt: new Date()
      };

      setUploadedFile(uploadedFile);
      setSuccess(`Academic paper "${file.name}" uploaded successfully! Redirecting to mdscholar.net for processing...`);

      // Reset form for potential next upload
      setTimeout(() => {
        // Here you would typically redirect to mdscholar.net with the file info
        window.open(`https://mdscholar.net?file=${encodeURIComponent(path)}&email=${encodeURIComponent(email)}`, '_blank');
      }, 2000);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [canProceed, isEmailValid, isTurnstileSolved, turnstileToken, email]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxSize: 25 * 1024 * 1024, // 25MB for academic papers
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    disabled: !canProceed,
    multiple: false
  });

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
    setIsTurnstileSolved(true);
    setError(null);
  };

  const handleTurnstileExpire = () => {
    setTurnstileToken(null);
    setIsTurnstileSolved(false);
  };

  const handleTurnstileError = () => {
    setTurnstileToken(null);
    setIsTurnstileSolved(false);
    setError('Security verification failed. Please try again.');
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
    setSuccess(null);
    setError(null);
    setTurnstileToken(null);
    setIsTurnstileSolved(false);
  };

  useEffect(() => {
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors.some(e => e.code === 'file-too-large')) {
        setError('File is too large. Maximum size is 25MB for academic papers.');
      } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        setError('Only PDF, DOC, and DOCX files are supported for academic papers.');
      } else {
        setError('File upload failed. Please try again.');
      }
    }
  }, [fileRejections]);

  if (!siteKey) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Turnstile site key is not configured. Please add NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY to your environment variables.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Academic Paper Upload</h1>
          </div>
          <p className="text-muted-foreground text-lg">
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
        <Card className="shadow-xl border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Upload Academic Paper
            </CardTitle>
            <CardDescription className="text-base">
              Secure upload with email verification for academic paper processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Input */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <Label htmlFor="email" className="font-medium">Email Address *</Label>
                {isEmailValid && (
                  <Badge variant="secondary" className="ml-auto">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Valid
                  </Badge>
                )}
              </div>
              <Input
                id="email"
                type="email"
                placeholder="your.email@institution.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`transition-colors ${
                  email && !isEmailValid ? 'border-destructive focus:border-destructive' : 
                  isEmailValid ? 'border-green-500 focus:border-green-500' : ''
                }`}
                required
              />
              {email && !isEmailValid && (
                <p className="text-sm text-destructive">Please enter a valid email address</p>
              )}
            </div>

            {/* Security Verification */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-medium">Security Verification</span>
                {isTurnstileSolved && (
                  <Badge variant="secondary" className="ml-auto">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="flex justify-center">
                <Turnstile
                  siteKey={siteKey}
                  onSuccess={handleTurnstileSuccess}
                  onExpire={handleTurnstileExpire}
                  onError={handleTurnstileError}
                />
              </div>
            </div>

            {/* File Upload Area */}
            {!uploadedFile && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-medium">Academic Paper Upload</span>
                </div>
                
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
                    ${isDragActive ? 'border-primary bg-primary/5 scale-105' : 'border-muted-foreground/25'}
                    ${!canProceed ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5 hover:scale-105'}
                  `}
                >
                  <input {...getInputProps()} />
                  
                  {isUploading ? (
                    <div className="space-y-4">
                      <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                      <div className="space-y-2">
                        <p className="text-lg font-medium">Processing your academic paper...</p>
                        <Progress value={uploadProgress} className="w-full" />
                        <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
                        <Upload className="h-12 w-12 text-primary" />
                      </div>
                      <div>
                        <p className="text-xl font-medium mb-2">
                          {isDragActive ? 'Drop your academic paper here' : 'Upload Academic Paper'}
                        </p>
                        <p className="text-muted-foreground mb-4">
                          Drag & drop or click to select your research paper
                        </p>
                        <div className="inline-flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm font-medium">PDF, DOC, DOCX (max 25MB)</span>
                        </div>
                      </div>
                      {!canProceed && (
                        <div className="space-y-2">
                          {!isEmailValid && (
                            <p className="text-sm text-amber-600 dark:text-amber-400">
                              ✓ Enter a valid email address
                            </p>
                          )}
                          {!isTurnstileSolved && (
                            <p className="text-sm text-amber-600 dark:text-amber-400">
                              ✓ Complete security verification
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Success State with File Info */}
            {uploadedFile && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">Paper Successfully Uploaded</span>
                </div>
                
                <div className="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-green-600 mt-0.5" />
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

                <div className="flex gap-3">
                  <Button 
                    onClick={() => window.open(`https://mdscholar.net?file=${encodeURIComponent(uploadedFile.path)}&email=${encodeURIComponent(email)}`, '_blank')}
                    className="flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Process on mdscholar.net
                  </Button>
                  <Button variant="outline" onClick={resetUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Another
                  </Button>
                </div>
              </div>
            )}

            {/* Status Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {success}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Features Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-background/50 border">
            <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
            <h3 className="font-medium mb-1">Secure Upload</h3>
            <p className="text-xs text-muted-foreground">
              Protected by Cloudflare Turnstile
            </p>
          </div>
          <div className="p-4 rounded-lg bg-background/50 border">
            <Sparkles className="h-6 w-6 mx-auto mb-2 text-primary" />
            <h3 className="font-medium mb-1">AI Processing</h3>
            <p className="text-xs text-muted-foreground">
              Advanced analysis on mdscholar.net
            </p>
          </div>
          <div className="p-4 rounded-lg bg-background/50 border">
            <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
            <h3 className="font-medium mb-1">Academic Focus</h3>
            <p className="text-xs text-muted-foreground">
              Optimized for research papers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}