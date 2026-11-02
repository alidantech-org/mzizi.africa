'use client';

import { Button } from '@/components/ui/button';

interface SidebarMaximizeToggleProps {
  onToggle: () => void;
}

export default function SidebarMaximizeToggle({ onToggle }: SidebarMaximizeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="absolute -right-3 top-6 h-6 w-6 rounded-full border border-border bg-card shadow-sm hover:bg-accent transition-colors flex items-center justify-center"
      title="Expand sidebar"
    >
      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
