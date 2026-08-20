'use client';

import SidebarLogoMinimized from './SidebarLogoMinimized';
import SidebarSearchMinimized from './SidebarSearchMinimized';
import SidebarNavigationMinimized from './SidebarNavigationMinimized';
import SidebarUserSectionMinimized from './SidebarUserSectionMinimized';

export default function SidebarContentMinimized() {
  return (
    <div className="flex h-full flex-col bg-card">
      {/* Logo - Fixed at top */}
      <SidebarLogoMinimized />

      {/* Search - Fixed after logo */}
      <div className="border-b border-border px-2 py-2">
        <SidebarSearchMinimized />
      </div>

      {/* Scrollable Navigation content area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <SidebarNavigationMinimized />
      </div>

      {/* User section - Fixed at bottom */}
      <SidebarUserSectionMinimized />

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--muted-foreground) / 0.3) transparent;
        }
      `}</style>
    </div>
  );
}
