'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import type { Query } from '@/app/admin/scraper/types';

interface DeleteQueryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: Query | null;
  onDeleteQuery: (query: Query) => Promise<void>;
  isLoading?: boolean;
}

export default function DeleteQueryDialog({ open, onOpenChange, query, onDeleteQuery, isLoading = false }: DeleteQueryDialogProps) {
  const handleDelete = async () => {
    if (!query) return;
    await onDeleteQuery(query);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Delete Scraping Query
          </DialogTitle>
          <DialogDescription>Are you sure you want to delete this scraping query? This action cannot be undone.</DialogDescription>
        </DialogHeader>

        {query && (
          <div className="py-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">{query.name}</h4>
              <p className="text-sm text-muted-foreground mb-1">
                <strong>URL:</strong> {query.url}
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                <strong>Frequency:</strong> {query.frequency}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Status:</strong> {query.status}
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading || !query}>
            {isLoading ? 'Deleting...' : 'Delete Query'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
