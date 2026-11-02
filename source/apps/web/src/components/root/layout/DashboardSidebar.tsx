'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Home, Users, Building2, FileText, Database, BarChart3, Activity } from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
  current: boolean;
}

interface DashboardSidebarProps {
  navigation: SidebarItem[];
  isMobile?: boolean;
  onClose?: () => void;
}

export function DashboardSidebar({ navigation, isMobile = false, onClose }: DashboardSidebarProps) {
  const SidebarContent = () => (
    <div className="flex flex-col flex-grow border-r bg-card">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img src="/images/logo.png" alt="Polifin Logo" className="w-32 h-12 rounded-lg object-contain px-4" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              item.current ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
            onClick={isMobile ? onClose : undefined}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );

  if (isMobile) {
    return (
      <div className="flex h-full flex-col">
        <SidebarContent />
      </div>
    );
  }

  return <SidebarContent />;
}
