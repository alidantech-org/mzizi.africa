'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarMinimizeToggleProps {
  isMinimized: boolean;
  onToggle: () => void;
}

export default function SidebarMinimizeToggle({ isMinimized, onToggle }: SidebarMinimizeToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="absolute -right-3 top-6 h-6 w-6 rounded-full border border-border bg-card shadow-sm hover:bg-accent"
    >
      {isMinimized ? (
        <ChevronRight className="h-3 w-3" />
      ) : (
        <ChevronLeft className="h-3 w-3" />
      )}
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}
