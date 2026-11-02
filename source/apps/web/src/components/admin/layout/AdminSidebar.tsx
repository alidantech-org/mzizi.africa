'use client';

import { useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import SidebarContent from './sidebar/SidebarContent';
import SidebarContentMinimized from './sidebar/SidebarContentMinimized';
import SidebarMaximizeToggle from './sidebar/SidebarMaximizeToggle';

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div
        data-sidebar
        className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ${
          isMinimized ? 'lg:w-16' : 'lg:w-64'
        }`}
      >
        <div className="flex h-full flex-col border-r relative">
          {/* Sidebar content */}
          {isMinimized ? (
            <SidebarContentMinimized />
          ) : (
            <SidebarContent
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isMinimized={isMinimized}
              onToggle={() => setIsMinimized(!isMinimized)}
            />
          )}
          {/* Maximize toggle - only visible when minimized */}
          {isMinimized && <SidebarMaximizeToggle onToggle={() => setIsMinimized(!isMinimized)} />}
        </div>
      </div>
    </>
  );
}
