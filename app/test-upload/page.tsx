"use client";

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Turnstile } from '@marsidev/react-turnstile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Image,
  Loader2,
  X
} from 'lucide-react';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  path: string;
  uploadedAt: Date;
}

export default function TestUploadPage() {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isTurnstileSolved, setIsTurnstileSolved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!isTurnstileSolved || !turnstileToken) {
      setError('Please complete the security verification first');
      return;
    }

    setError(null);
    setSuccess(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const file = acceptedFiles[0];
      const ext = file.name.split('.').pop()?.toLowerCase() || 'dat';

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

      // Add to uploaded files list
      const uploadedFile: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        path: path,
        uploadedAt: new Date()
      };

      setUploadedFiles(prev => [uploadedFile, ...prev]);
      setSuccess(`File "${file.name}" uploaded successfully!`);

      // Reset Turnstile for next upload
      setTurnstileToken(null);
      setIsTurnstileSolved(false);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [isTurnstileSolved, turnstileToken]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/gif': ['.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    disabled: !isTurnstileSolved || isUploading,
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

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors.some(e => e.code === 'file-too-large')) {
        setError('File is too large. Maximum size is 5MB.');
      } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        setError('File type not supported. Please upload PNG, JPG, GIF, PDF, DOC, DOCX, or TXT files.');
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
      <div className="container mx-auto max-w-4xl py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Secure File Upload</h1>
          <p className="text-muted-foreground">
            Upload files securely with Cloudflare Turnstile protection
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upload Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                File Upload
              </CardTitle>
              <CardDescription>
                Complete security verification and upload your files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

              {/* Upload Area */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-primary" />
                  <span className="font-medium">File Upload</span>
                </div>
                
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
                    ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
                    ${!isTurnstileSolved || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}
                  `}
                >
                  <input {...getInputProps()} />
                  
                  {isUploading ? (
                    <div className="space-y-4">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Uploading...</p>
                        <Progress value={uploadProgress} className="w-full" />
                        <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium">
                          {isDragActive ? 'Drop your file here' : 'Drag & drop or click to upload'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          PNG, JPG, GIF, PDF, DOC, DOCX, TXT (max 5MB)
                        </p>
                      </div>
                      {!isTurnstileSolved && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          Complete security verification to enable upload
                        </p>
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

          {/* Uploaded Files Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Uploaded Files
                {uploadedFiles.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {uploadedFiles.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Your recently uploaded files
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadedFiles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No files uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>{file.uploadedAt.toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeUploadedFile(index)}
                        className="flex-shrink-0 h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Cloudflare Turnstile Protection</h4>
                <p className="text-sm text-muted-foreground">
                  Every upload is protected by Cloudflare Turnstile to prevent automated abuse and ensure only legitimate users can upload files.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Server-Side Validation</h4>
                <p className="text-sm text-muted-foreground">
                  All uploads are validated on the server using service role authentication, ensuring secure file storage in private buckets.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">File Type Restrictions</h4>
                <p className="text-sm text-muted-foreground">
                  Only approved file types are allowed: images (PNG, JPG, GIF), documents (PDF, DOC, DOCX), and text files.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Size Limitations</h4>
                <p className="text-sm text-muted-foreground">
                  Files are limited to 5MB to ensure optimal performance and prevent abuse of storage resources.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}