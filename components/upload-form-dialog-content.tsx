"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Turnstile } from '@marsidev/react-turnstile';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  Upload, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Loader2,
  Mail,
  Sparkles
} from 'lucide-react';

interface UploadFormDialogContentProps {
  onClose: () => void;
}

export function UploadFormDialogContent({ onClose }: UploadFormDialogContentProps) {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isTurnstileSolved, setIsTurnstileSolved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    setIsEmailValid(validateEmail(email));
  }, [email]);

  const canProceed = isEmailValid && isTurnstileSolved && !isUploading;

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
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const file = acceptedFiles[0];
      const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';

      // Simulate progress for better UX
      setUploadProgress(10);

      // Get signed upload URL
      const res = await fetch('/.netlify/functions/get-upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ext, turnstileToken }),
      });

      setUploadProgress(30);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to get upload URL');
      }

      const { signedUrl, path } = await res.json();
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

      // Close dialog and redirect to home
      onClose();
      router.push('/');

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [canProceed, isEmailValid, isTurnstileSolved, turnstileToken, email, onClose, router]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxSize: 10 * 1024 * 1024, // 10MB for academic papers
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

  useEffect(() => {
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors.some(e => e.code === 'file-too-large')) {
        setError('File is too large. Maximum size is 10MB for academic papers.');
      } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        setError('Only PDF, DOC, and DOCX files are supported for academic papers.');
      } else {
        setError('File upload failed. Please try again.');
      }
    }
  }, [fileRejections]);

  if (!siteKey) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Turnstile site key is not configured. Please add NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY to your environment variables.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          Upload Academic Paper
        </DialogTitle>
        <DialogDescription className="text-base">
          Secure upload with email verification for academic paper processing
        </DialogDescription>
      </DialogHeader>

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
                  <span className="text-sm font-medium">PDF, DOC, DOCX (max 10MB)</span>
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

      {/* Status Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}