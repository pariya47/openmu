"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Upload, 
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

interface CreateTaskResponse {
  task_id: string;
  status: string;
  message: string;
}

export function UploadFormDialogContent({ onClose }: UploadFormDialogContentProps) {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [taskResponse, setTaskResponse] = useState<CreateTaskResponse | null>(null);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    setIsEmailValid(validateEmail(email));
  }, [email]);

  const canProceed = isEmailValid && !isUploading;

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!canProceed) {
      if (!isEmailValid) {
        setError('Please enter a valid email address first');
        toast.error('Please enter a valid email address first');
      }
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const file = acceptedFiles[0];
      
      // Create FormData object
      const formData = new FormData();
      formData.append('email', email);
      formData.append('file', file);

      setUploadProgress(30);

      // Upload to the new API endpoint
      const response = await fetch('https://api.mdscholar.net/v1/research/create', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result: CreateTaskResponse = await response.json();
      setTaskResponse(result);
      setUploadProgress(100);
      
      toast.success('Upload successful! Your paper is being processed.');

      // Close dialog and redirect to home after a brief delay
      setTimeout(() => {
        onClose();
        router.push('/');
      }, 1500);

    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      if (!taskResponse) {
        setUploadProgress(0);
      }
    }
  }, [canProceed, isEmailValid, email, onClose, router, taskResponse]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxSize: 50 * 1024 * 1024, // 50MB for academic papers
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    disabled: !canProceed,
    multiple: false
  });

  useEffect(() => {
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors.some(e => e.code === 'file-too-large')) {
        const errorMsg = 'File is too large. Maximum size is 50MB for academic papers.';
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        const errorMsg = 'Only PDF, DOC, DOCX, TXT, and MD files are supported for academic papers.';
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        const errorMsg = 'File upload failed. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    }
  }, [fileRejections]);

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3 text-2xl text-foreground">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          Upload Academic Paper
        </DialogTitle>
        <DialogDescription className="text-base text-muted-foreground">
          Upload your academic paper for AI-powered processing and analysis
        </DialogDescription>
      </DialogHeader>

      {/* Success Message */}
      {taskResponse && (
        <Alert className="border-success bg-success/10">
          <CheckCircle className="h-4 w-4 text-success" />
          <AlertDescription className="text-success">
            <div className="space-y-1">
              <p className="font-medium">Upload successful!</p>
              <p className="text-sm">Task ID: {taskResponse.task_id}</p>
              <p className="text-sm">{taskResponse.message}</p>
              <p className="text-sm">Redirecting to dashboard...</p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Email Input */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          <Label htmlFor="email" className="font-medium text-foreground">Email Address *</Label>
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
            isEmailValid ? 'border-success focus:border-success' : ''
          }`}
          disabled={isUploading || !!taskResponse}
          required
          aria-describedby={email && !isEmailValid ? "email-error" : undefined}
        />
        {email && !isEmailValid && (
          <p id="email-error" className="text-sm text-destructive">Please enter a valid email address</p>
        )}
      </div>

      {/* File Upload Area */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">Academic Paper Upload</span>
        </div>
        
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
            ${isDragActive ? 'border-primary bg-primary/5 scale-105' : 'border-border'}
            ${!canProceed || taskResponse ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5 hover:scale-105'}
          `}
          role="button"
          tabIndex={0}
          aria-label="Upload academic paper file"
        >
          <input {...getInputProps()} />
          
          {isUploading ? (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-foreground">Processing your academic paper...</p>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
              </div>
            </div>
          ) : taskResponse ? (
            <div className="space-y-4">
              <div className="p-4 rounded-full bg-success/10 w-fit mx-auto">
                <CheckCircle className="h-12 w-12 text-success" />
              </div>
              <div>
                <p className="text-xl font-medium mb-2 text-success">
                  Upload Complete!
                </p>
                <p className="text-muted-foreground">
                  Your paper is being processed. You'll receive updates via email.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
                <Upload className="h-12 w-12 text-primary" />
              </div>
              <div>
                <p className="text-xl font-medium mb-2 text-foreground">
                  {isDragActive ? 'Drop your academic paper here' : 'Upload Academic Paper'}
                </p>
                <p className="text-muted-foreground mb-4">
                  Drag & drop or click to select your research paper
                </p>
                <div className="inline-flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">PDF, DOC, DOCX, TXT, MD (max 50MB)</span>
                </div>
              </div>
              {!canProceed && (
                <div className="space-y-2">
                  {!isEmailValid && (
                    <p className="text-sm text-warning">
                      ✓ Enter a valid email address to continue
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