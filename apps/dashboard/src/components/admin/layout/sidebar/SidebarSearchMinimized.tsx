'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

export default function SidebarSearchMinimized() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Search Trigger */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setSearchOpen(true)}
        className="w-full justify-center"
        title="Search"
      >
        <Search className="h-4 w-4" />
      </Button>

      {/* Full Screen Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
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
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex-1 overflow-auto mt-4">
            {searchQuery ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">Searching for &quot;{searchQuery}&quot;...</div>
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
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="outline" className="justify-start">
                      <Search className="h-4 w-4 mr-2" />
                      Search Everything
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
    </>
  );
}
