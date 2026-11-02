'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, X, Upload, Mail } from 'lucide-react';

export default function AppBarSearch() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex-1 flex items-center justify-center">
      {/* Icon only on small screens */}
      <Button variant="outline" size="sm" className="sm:hidden" onClick={() => setSearchOpen(true)}>
        <Search className="h-5 w-5" />
      </Button>

      {/* Full button on larger screens */}
      <Button variant="outline" size={'sm'} className="hidden sm:flex flex-1 max-w-md justify-start text-muted-foreground" onClick={() => setSearchOpen(true)}>
        <Search className="h-4 w-4 mr-2" />
        <span>Search everything...</span>
        <kbd className="ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </Button>

      {/* Full Screen Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="lg:min-w-7xl md:min-w-3xl h-[95vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Global Search</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search donations, donors, transactions, reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
              autoFocus
            />
            {searchQuery && (
              <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setSearchQuery('')}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex-1 overflow-auto mt-4">
            {searchQuery ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">Searching for &quot;{searchQuery}&quot;...</div>
                {/* Search results would be rendered here */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Recent Searches</p>
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <Search className="h-4 w-4 mr-2" />
                      Campaign donations 2024
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <Search className="h-4 w-4 mr-2" />
                      Suspicious transactions
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <Search className="h-4 w-4 mr-2" />
                      Monthly reports
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Compose Email
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Recent Searches</p>
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <Search className="h-4 w-4 mr-2" />
                      Campaign donations 2024
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <Search className="h-4 w-4 mr-2" />
                      Suspicious transactions
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <Search className="h-4 w-4 mr-2" />
                      Monthly reports
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
