'use client';

import SidebarTrigger from './sidebar/SidebarTrigger';
import AppBarBreadcrumbs from './appbar/AppBarBreadcrumbs';
import AppBarSearch from './appbar/AppBarSearch';
import AppBarNotifications from './appbar/AppBarNotifications';
import AppBarThemeToggle from './appbar/AppBarThemeToggle';
import Link from 'next/link';

interface AdminAppBarProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminAppBar({ setSidebarOpen }: AdminAppBarProps) {
  return (
    <>
      <div className="sticky top-0 z-40 flex h-14 shrink-0 justify-between items-center backdrop-blur-md gap-x-4 border-b border-border bg-card/95 px-2.5 md:px-4">
        {/* Mobile menu button */}
        <div className="flex gap-4 lg:hidden items-center">
          <SidebarTrigger onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 lg:hidden" />{' '}
          <Link href="/admin" className="flex items-center gap-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Kenya.svg/330px-Flag_of_Kenya.svg.png"
              alt="Kenya Flag"
              className="h-5 w-7 rounded-none object-cover"
            />
            <span className="text-lg font-bold text-foreground">Katiba</span>
          </Link>
        </div>
        {/* Left side - Breadcrumbs */}
        <div className="hidden lg:block flex items-center gap-x-4 min-w-0 flex-1 lg:flex-initial">
          <AppBarBreadcrumbs />
        </div>
        <div className="flex items-center gap-x-2 lg:gap-x-3">
          <AppBarNotifications />
          <AppBarThemeToggle /> 
          <AppBarSearch />
        </div>
      </div>
    </>
  );
}
