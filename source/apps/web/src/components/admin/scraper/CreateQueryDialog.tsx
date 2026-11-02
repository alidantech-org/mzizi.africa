'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface CreateQueryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateQuery: (query: {
    name: string;
    url: string;
    frequency: string;
    selectors: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export default function CreateQueryDialog({
  open,
  onOpenChange,
  onCreateQuery,
  isLoading = false,
}: CreateQueryDialogProps) {
  const [newQuery, setNewQuery] = useState({
    name: '',
    url: '',
    frequency: 'daily',
    selectors: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuery.name || !newQuery.url) return;
    
    await onCreateQuery(newQuery);
    setNewQuery({ name: '', url: '', frequency: 'daily', selectors: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Scraping Query</DialogTitle>
          <DialogDescription>
            Configure a new web scraping task to collect political finance data.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Query Name</Label>
              <Input
                id="name"
                placeholder="e.g., FEC Donations Monitor"
                value={newQuery.name}
                onChange={(e) => setNewQuery({ ...newQuery, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">Target URL</Label>
              <Input
                id="url"
                placeholder="https://example.gov/data"
                type="url"
                value={newQuery.url}
                onChange={(e) => setNewQuery({ ...newQuery, url: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="frequency">Scraping Frequency</Label>
              <Select 
                value={newQuery.frequency} 
                onValueChange={(value) => setNewQuery({ ...newQuery, frequency: value })}
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
              <Label htmlFor="selectors">CSS Selectors (Optional)</Label>
              <Textarea
                id="selectors"
                placeholder="Enter CSS selectors for data extraction..."
                value={newQuery.selectors}
                onChange={(e) => setNewQuery({ ...newQuery, selectors: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !newQuery.name || !newQuery.url}>
              {isLoading ? 'Creating...' : 'Create Query'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
