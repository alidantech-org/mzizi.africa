'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Play, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { Query } from '@/app/admin/scraper/types';

interface RunQueryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: Query | null;
  onRunQuery: (query: Query) => Promise<void>;
  isLoading?: boolean;
}

export default function RunQueryDialog({ open, onOpenChange, query, onRunQuery, isLoading = false }: RunQueryDialogProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  const handleRun = async () => {
    if (!query) return;

    setStatus('running');
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await onRunQuery(query);
      setStatus('success');
      setProgress(100);
    } catch (error) {
      setStatus('error');
    } finally {
      clearInterval(progressInterval);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setProgress(0);
      setStatus('idle');
      onOpenChange(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Play className="w-5 h-5" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'running':
        return 'Running scraping query...';
      case 'success':
        return 'Scraping completed successfully!';
      case 'error':
        return 'Scraping failed. Please try again.';
      default:
        return 'Ready to run scraping query';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Run Scraping Query
          </DialogTitle>
          <DialogDescription>Execute the web scraping task to collect data from the target URL.</DialogDescription>
        </DialogHeader>

        {query && (
          <div className="py-4">
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <h4 className="font-medium mb-2">{query.name}</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Target:</strong> {query.url}
              </p>
            </div>

            {status !== 'idle' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{getStatusMessage()}</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            {status === 'success' ? 'Close' : 'Cancel'}
          </Button>
          {status === 'idle' && (
            <Button type="button" onClick={handleRun} disabled={isLoading || !query}>
              {isLoading ? 'Starting...' : 'Run Query'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
