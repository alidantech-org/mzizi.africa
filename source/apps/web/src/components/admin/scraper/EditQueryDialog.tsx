'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Query } from '@/app/admin/scraper/types';

interface EditQueryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: Query | null;
  onUpdateQuery: (query: Query) => Promise<void>;
  isLoading?: boolean;
}

export default function EditQueryDialog({ open, onOpenChange, query, onUpdateQuery, isLoading = false }: EditQueryDialogProps) {
  const [editedQuery, setEditedQuery] = useState<Query | null>(null);

  useEffect(() => {
    setEditedQuery(query);
  }, [query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedQuery || !editedQuery.name || !editedQuery.url) return;

    await onUpdateQuery(editedQuery);
  };

  if (!editedQuery) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Scraping Query</DialogTitle>
          <DialogDescription>Modify the configuration of this web scraping task.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Query Name</Label>
              <Input
                id="edit-name"
                value={editedQuery.name}
                onChange={(e) => setEditedQuery({ ...editedQuery, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-url">Target URL</Label>
              <Input
                id="edit-url"
                type="url"
                value={editedQuery.url}
                onChange={(e) => setEditedQuery({ ...editedQuery, url: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-frequency">Scraping Frequency</Label>
              <Select
                value={editedQuery.frequency}
                onValueChange={(value) => setEditedQuery({ ...editedQuery, frequency: value as 'hourly' | 'daily' | 'weekly' | 'monthly' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editedQuery.status}
                onValueChange={(value) => setEditedQuery({ ...editedQuery, status: value as 'active' | 'paused' | 'archived' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !editedQuery.name || !editedQuery.url}>
              {isLoading ? 'Updating...' : 'Update Query'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
