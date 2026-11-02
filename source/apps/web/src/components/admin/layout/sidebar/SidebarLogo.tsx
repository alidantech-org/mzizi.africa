'use client';

import Link from 'next/link';

interface SidebarLogoProps {
  isMinimized?: boolean;
  onToggle?: () => void;
}

export default function SidebarLogo({ isMinimized = false, onToggle }: SidebarLogoProps) {
  return (
    <div className="flex h-14 shrink-0 items-center border-b px-4 relative">
      <Link href="/admin" className="flex items-center gap-2">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Kenya.svg/330px-Flag_of_Kenya.svg.png"
          alt="Kenya Flag"
          className="h-6 w-8 rounded-none object-cover"
        />
        {!isMinimized && <span className="text-lg font-bold text-foreground">Katiba</span>}
      </Link>

      {/* Minimize toggle - visible when expanded */}
      {!isMinimized && onToggle && (
        <button
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border border-border bg-card shadow-sm hover:bg-accent transition-colors flex items-center justify-center"
          title="Minimize sidebar"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}
