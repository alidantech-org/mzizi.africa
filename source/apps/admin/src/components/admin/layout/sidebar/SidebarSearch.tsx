'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SidebarSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check on mount
    checkMobile();

    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

export default function SidebarSearch({ searchQuery, setSearchQuery }: SidebarSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const [userInitiated, setUserInitiated] = useState(false);

  useEffect(() => {
    // On mobile, blur the input to prevent keyboard from launching automatically
    if (isMobile && inputRef.current && !userInitiated) {
      inputRef.current.blur();
    }
  }, [isMobile, userInitiated]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // On mobile, prevent auto-focus from triggering keyboard unless user initiated
    if (isMobile && !userInitiated) {
      e.target.blur();
    }
  };

  const handleClick = () => {
    // Allow focus when user explicitly clicks/taps
    setUserInitiated(true);
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    // Reset user initiated state on blur
    setUserInitiated(false);
  };

  return (
    <div className="shrink-0 px-2 h-12 flex items-center border-b border-border">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search navigation..."
          value={searchQuery}
          autoFocus={false}
          autoComplete="off"
          onFocus={handleFocus}
          onClick={handleClick}
          onBlur={handleBlur}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 bg-background w-full"
        />
      </div>
    </div>
  );
}
