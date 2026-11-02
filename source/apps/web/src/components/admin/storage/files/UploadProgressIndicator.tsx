'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Minimize2, Maximize2, File, CheckCircle, AlertCircle, Pause, Play } from 'lucide-react';
import { useUpload } from '@/contexts/UploadContext';
import { cn } from '@/lib/utils';

export default function UploadProgressIndicator() {
  const [minimized, setMinimized] = useState(false);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { sessions, currentSession, getOverallProgress, getActiveUploadsCount, pauseUpload, resumeUpload } = useUpload();

  const overallProgress = getOverallProgress();
  const activeUploadsCount = getActiveUploadsCount();
  const activeSession = currentSession || sessions[0];

  // Auto-dismiss when all uploads complete successfully
  useEffect(() => {
    if (activeSession && activeSession.files.length > 0) {
      const allCompleted = activeSession.files.every((file) => file.status === 'success');
      const hasFailedFiles = activeSession.files.some((file) => file.status === 'error');

      if (allCompleted && !hasFailedFiles && overallProgress === 100) {
        const timer = setTimeout(() => {
          setDismissed(true);
        }, 3000); // Auto-dismiss after 3 seconds

        return () => clearTimeout(timer);
      }
    }
  }, [activeSession, overallProgress]);

  // Don't show if no uploads or if dismissed
  if (!activeSession || activeSession.files.length === 0 || dismissed) {
    return null;
  }

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
        return <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" />;
      case 'success':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      case 'paused':
        return <Pause className="h-3 w-3 text-yellow-500" />;
      default:
        return <File className="h-3 w-3 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'bg-primary';
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-destructive';
      case 'paused':
        return 'bg-yellow-500';
      default:
        return 'bg-muted';
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-background border border-border rounded-lg shadow-lg p-3 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Uploading</span>
              <Badge variant="secondary" className="text-xs">
                {activeUploadsCount}
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setMinimized(false)}>
                <Maximize2 className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleDismiss}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">
            {Math.round(overallProgress)}% • {activeSession.completedFiles}/{activeSession.totalFiles} files
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-background border border-border rounded-lg shadow-lg w-80">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Upload Progress</span>
            {activeUploadsCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeUploadsCount} active
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setMinimized(true)}>
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <File className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Upload Details</DialogTitle>
                  <DialogDescription>Detailed view of all upload sessions and files</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Session {session.id.slice(-8)}</h4>
                        <div className="text-sm text-muted-foreground">
                          {session.completedFiles}/{session.totalFiles} files
                        </div>
                      </div>

                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {session.files.map((file) => (
                          <div key={file.id} className="flex items-center gap-3 p-2 border rounded">
                            {getStatusIcon(file.status)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="text-sm max-w-sm font-medium truncate">{file.name}</div>
                                <div className="text-xs text-muted-foreground">{formatFileSize(file.size)}</div>
                              </div>
                              {file.status === 'uploading' && <Progress value={file.progress} className="h-1 mt-1" />}
                            </div>
                            <div className="flex gap-1">
                              {file.status === 'uploading' && (
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => pauseUpload(session.id, file.id)}>
                                  <Pause className="h-3 w-3" />
                                </Button>
                              )}
                              {file.status === 'paused' && (
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => resumeUpload(session.id, file.id)}>
                                  <Play className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Size:</span>
                            <span className="ml-2 font-medium">
                              {formatFileSize(session.uploadedSize)}/{formatFileSize(session.totalSize)}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Progress:</span>
                            <span className="ml-2 font-medium">
                              {session.totalSize > 0 ? Math.round((session.uploadedSize / session.totalSize) * 100) : 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleDismiss}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="p-3 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />

          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              Files: {activeSession.completedFiles}/{activeSession.totalFiles}
            </div>
            <div>
              Size: {formatFileSize(activeSession.uploadedSize)}/{formatFileSize(activeSession.totalSize)}
            </div>
          </div>

          {/* File Status Summary */}
          <div className="flex gap-2 flex-wrap">
            {Object.entries(
              activeSession.files.reduce(
                (acc, file) => {
                  acc[file.status] = (acc[file.status] || 0) + 1;
                  return acc;
                },
                {} as Record<string, number>,
              ),
            ).map(([status, count]) => (
              <div key={status} className="flex items-center gap-1">
                <div className={cn('w-2 h-2 rounded-full', getStatusColor(status))} />
                <span className="text-xs capitalize">
                  {status} ({count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
