// pages/index.tsx
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function TestUploadPage() {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    const ext = file.name.split('.').pop()?.toLowerCase() || 'dat';

    const res = await fetch('/api/get-upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ext }),
    });

    const { signedUrl, path } = await res.json();

    await fetch(signedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    alert(`File uploaded: ${path}`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg', '.jpg'],
    },
  });

  return (
    <div {...getRootProps()} style={{ border: '2px dashed gray', padding: 40 }}>
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the files here ...</p> : <p>Drag & drop or click to upload</p>}
    </div>
  );
}
