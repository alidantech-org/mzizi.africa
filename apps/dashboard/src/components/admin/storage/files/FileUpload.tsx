'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, File, X, CheckCircle, AlertCircle, Plus, Pause, Play, RotateCcw, FolderOpen, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { useUpload } from '@/contexts/UploadContext';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';

interface FileUploadProps {
  onUploadComplete?: () => void;
  trigger?: React.ReactNode;
  maxFiles?: number;
  maxSize?: number;
  allowDirectory?: boolean;
}

export default function FileUpload({
  onUploadComplete,
  trigger,
  maxFiles = 100,
  maxSize = 100 * 1024 * 1024,
  allowDirectory = true,
}: FileUploadProps) {
  const [open, setOpen] = useState(false);
  const [uploadPath, setUploadPath] = useState<'default' | 'assets'>('default');
  const { addFiles, sessions, currentSession, removeFile, pauseUpload, resumeUpload, retryUpload, clearSession } = useUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const directoryInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Check if we should reload on upload success
  const shouldReloadOnSuccess = pathname === '/admin/storage/explore';

  const activeSession = currentSession || sessions[0];

  useEffect(() => {
    if (!shouldReloadOnSuccess || !activeSession) return;

    const checkUploadCompletion = () => {
      if (activeSession.files.length > 0) {
        const allCompleted = activeSession.files.every((file) => file.status === 'success');
        const hasFailed = activeSession.files.some((file) => file.status === 'error');

        if (allCompleted) {
          // All files uploaded successfully
          toast.success('All files uploaded successfully!');
          onUploadComplete?.();
          // Reload the page to refresh the file list
          router.refresh();
        } else if (hasFailed && activeSession.files.every((file) => file.status === 'success' || file.status === 'error')) {
          // Some files failed, but all are done
          const failedCount = activeSession.files.filter((file) => file.status === 'error').length;
          const successCount = activeSession.files.filter((file) => file.status === 'success').length;
          toast.warning(`Upload completed: ${successCount} successful, ${failedCount} failed`);
          onUploadComplete?.();
          // Still reload to show successful uploads
          router.refresh();
        }
      }
    };

    checkUploadCompletion();
  }, [activeSession?.files, shouldReloadOnSuccess, onUploadComplete, router]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file, errors }) => {
          errors.forEach((error: any) => {
            if (error.code === 'file-too-large') {
              toast.error(`${file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
            } else if (error.code === 'too-many-files') {
              toast.error(`Too many files. Maximum is ${maxFiles} files`);
            } else {
              toast.error(`${file.name}: ${error.message}`);
            }
          });
        });
      }

      if (acceptedFiles.length > 0) {
        // Check if any files have webkitRelativePath (indicating directory drop)
        const hasDirectoryStructure = acceptedFiles.some((file) => file.webkitRelativePath && file.webkitRelativePath.includes('/'));

        if (hasDirectoryStructure) {
          // Extract relative paths from webkitRelativePath for directory uploads
          const relativePaths = acceptedFiles.map((file) => file.webkitRelativePath || '');
          addFiles(acceptedFiles, { isFromDirectory: true, relativePaths, uploadPath });
          toast.success(`Added ${acceptedFiles.length} files from directory to upload queue`);
        } else {
          // Regular file upload
          addFiles(acceptedFiles, { uploadPath });
          toast.success(`Added ${acceptedFiles.length} file(s) to upload queue`);
        }
      }
    },
    [maxFiles, maxSize, addFiles],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {}, // Accept all file types
    maxSize,
    maxFiles,
    noClick: true, // Disable default click behavior to use custom file inputs
    noKeyboard: true, // Disable keyboard events
  });

  const handleDirectorySelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      // Extract relative paths from webkitRelativePath
      const relativePaths = Array.from(files).map((file) => file.webkitRelativePath || '');
      addFiles(files, { isFromDirectory: true, relativePaths, uploadPath });
      toast.success(`Added ${files.length} files from directory to upload queue`);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      addFiles(files, { isFromDirectory: false, uploadPath });
      toast.success(`Added ${files.length} file(s) to upload queue`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionButton = (file: any, sessionId: string) => {
    switch (file.status) {
      case 'uploading':
        return (
          <Button variant="ghost" size="sm" onClick={() => pauseUpload(sessionId, file.id)}>
            <Pause className="h-4 w-4" />
          </Button>
        );
      case 'paused':
        return (
          <Button variant="ghost" size="sm" onClick={() => resumeUpload(sessionId, file.id)}>
            <Play className="h-4 w-4" />
          </Button>
        );
      case 'error':
        return (
          <Button variant="ghost" size="sm" onClick={() => retryUpload(sessionId, file.id)}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        );
      default:
        return null;
    }
  };

  const defaultTrigger = (
    <Button className="w-auto">
      Upload <Upload className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-7xl h-[80vh] gap-0 max-h-[800px] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 p-3 md:p-4 mb-0 border-b items-center flex-row flex justify-between gap-2">
          <div className="flex-1 min-w-0">
            <DialogTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Upload className="h-4 w-4 md:h-5 md:w-5" />
              <span className="truncate">Upload Files</span>
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm mt-1 truncate">
              Drag and drop files here, or click to select files.
            </DialogDescription>
          </div>
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            {/* Desktop: Full directory selector */}
            <div className="hidden sm:flex items-center gap-1 md:gap-2">
              <FolderOpen className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              <label className="text-xs md:text-sm font-medium whitespace-nowrap">Upload to:</label>
              <Select value={uploadPath} onValueChange={(value: 'default' | 'assets') => setUploadPath(value)}>
                <SelectTrigger className="w-32 md:w-48 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="assets">Assets</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile: Compact directory selector */}
            <div className="sm:hidden">
              <Select value={uploadPath} onValueChange={(value: 'default' | 'assets') => setUploadPath(value)}>
                <SelectTrigger className="w-20 h-8 text-xs px-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-3 w-3" />
                      <span>Default</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="assets">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-3 w-3" />
                      <span>Assets</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={isDragActive} className="h-8 px-2 md:px-3">
              <X className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline ml-1">Close</span>
            </Button>
          </div>
        </DialogHeader>
        {/* Folder Selection */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed border-border flex-1 rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragActive && !isDragReject && 'border-primary bg-primary/10',
              isDragReject && 'border-destructive bg-destructive/10',
              !isDragActive && 'border-border hover:border-primary/50',
            )}
          >
            <input {...getInputProps()} />
            <Upload
              className={cn(
                'mx-auto h-12 w-12 mb-4 transition-colors',
                isDragActive && !isDragReject && 'text-primary',
                isDragReject && 'text-destructive',
                !isDragActive && 'text-muted-foreground',
              )}
            />
            <div className="text-sm space-y-1">
              {isDragActive ? (
                <p className={cn('font-medium', isDragReject ? 'text-destructive' : 'text-primary')}>
                  {isDragReject ? 'Too many files or file too large' : 'Drop files here'}
                </p>
              ) : (
                <>
                  <p className="text-muted-foreground">Drag and drop files here, or click to select files</p>
                  <p className="text-xs text-muted-foreground">
                    Maximum {maxFiles} files, {maxSize / (1024 * 1024)}MB per file
                  </p>
                  {allowDirectory && <p className="text-xs text-muted-foreground">Supports directory upload - all file types allowed</p>}
                </>
              )}
            </div>

            {/* Hidden file inputs */}
            <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" />
            {allowDirectory && (
              <input
                ref={directoryInputRef}
                type="file"
                multiple
                {...({ webkitdirectory: '' } as any)}
                onChange={handleDirectorySelect}
                className="hidden"
              />
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isDragActive} className="w-full sm:w-auto">
                <File className="h-4 w-4 mr-2" />
                Select Files
              </Button>
              {allowDirectory && (
                <Button
                  variant="outline"
                  onClick={() => directoryInputRef.current?.click()}
                  disabled={isDragActive}
                  className="w-full sm:w-auto"
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Select Directory
                </Button>
              )}
            </div>
          </div>

          {/* File List */}
          {activeSession && activeSession.files.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="font-medium text-sm md:text-base">
                  Upload Queue
                  <span className="text-xs md:text-sm text-muted-foreground ml-1">({activeSession.files.length} files)</span>
                </h4>
                <div className="flex gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Start/resume all pending uploads
                      activeSession.files
                        .filter((f) => f.status === 'pending' || f.status === 'paused')
                        .forEach((file) => resumeUpload(activeSession.id, file.id));
                    }}
                    disabled={!activeSession.files.some((f) => f.status === 'pending' || f.status === 'paused')}
                    className="flex-1 sm:flex-none"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Start Upload</span>
                    <span className="sm:hidden">Start</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => clearSession(activeSession.id)} className="flex-1 sm:flex-none">
                    <X className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Clear All</span>
                    <span className="sm:hidden">Clear</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {activeSession.files.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    {getStatusIcon(file.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium truncate max-w-[300px]" title={file.name}>
                          {file.name}
                        </div>
                        <div className="text-sm text-muted-foreground ml-2 flex-shrink-0">{formatFileSize(file.size)}</div>
                      </div>
                      {file.status === 'uploading' && <Progress value={file.progress} className="mt-2" />}
                      {file.status === 'error' && <p className="text-xs text-destructive mt-1">Upload failed</p>}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {getActionButton(file, activeSession.id)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(activeSession.id, file.id)}
                        disabled={file.status === 'uploading'}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Upload Progress Footer */}
        <DialogHeader className="flex-shrink-0 border-t">
          {activeSession &&
            activeSession.completedFiles !== undefined &&
            activeSession.totalFiles !== undefined &&
            activeSession.uploadedSize !== undefined &&
            activeSession.totalSize !== undefined && (
              <div className="bg-muted/50 p-2 md:p-3 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
                  <div className="col-span-2 md:col-span-1">
                    <span className="text-muted-foreground">Files:</span>
                    <span className="ml-1 md:ml-2 font-medium">
                      {activeSession.completedFiles}/{activeSession.totalFiles}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="ml-2 font-medium">
                      {formatFileSize(activeSession.uploadedSize)}/{formatFileSize(activeSession.totalSize)}
                      {activeSession.totalSize > 0 && (
                        <span className="ml-2 font-normal text-xs">
                          ({Math.round((activeSession.uploadedSize / activeSession.totalSize) * 100)}%)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="md:col-span-1">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="ml-1 md:ml-2 font-medium">
                      {activeSession.totalSize > 0 ? Math.round((activeSession.uploadedSize / activeSession.totalSize) * 100) : 0}%
                    </span>
                  </div>
                  {/* Mobile size info */}
                  <div className="md:hidden text-xs text-muted-foreground">
                    {formatFileSize(activeSession.uploadedSize)}/{formatFileSize(activeSession.totalSize)}
                  </div>
                </div>
              </div>
            )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
