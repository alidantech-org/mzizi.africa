'use client';

import { useState } from 'react';
import SidebarLogo from './SidebarLogo';
import SidebarSearch from './SidebarSearch';
import SidebarNavigation from './SidebarNavigation';
import SidebarUserSection from './SidebarUserSection';

interface SidebarContentProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isMinimized?: boolean;
  onToggle?: () => void;
}

export default function SidebarContent({ searchQuery, setSearchQuery, isMinimized = false, onToggle }: SidebarContentProps) {
  const [politicalOpen, setPoliticalOpen] = useState(false);
  const [geographicOpen, setGeographicOpen] = useState(false);
  const [demographicsOpen, setDemographicsOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [systemOpen, setSystemOpen] = useState(false);

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Logo - Fixed at top */}
      <SidebarLogo isMinimized={isMinimized} onToggle={onToggle} />

      {/* Search Bar - Fixed */}
      <SidebarSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Scrollable Navigation content area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <SidebarNavigation
          searchQuery={searchQuery}
          politicalOpen={politicalOpen}
          setPoliticalOpen={setPoliticalOpen}
          geographicOpen={geographicOpen}
          setGeographicOpen={setGeographicOpen}
          demographicsOpen={demographicsOpen}
          setDemographicsOpen={setDemographicsOpen}
          analyticsOpen={analyticsOpen}
          setAnalyticsOpen={setAnalyticsOpen}
          systemOpen={systemOpen}
          setSystemOpen={setSystemOpen}
        />
      </div>

      {/* User section - Fixed at bottom */}
      <SidebarUserSection />

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 3px;
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
