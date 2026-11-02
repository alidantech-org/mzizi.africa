'use client';

import {
  Home,
  FileText,
  Search,
  LifeBuoy,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Landmark,
  MapPin,
  PieChart,
  BarChart3,
  Settings,
} from 'lucide-react';
import SidebarNavLinkMinimized from './SidebarNavLinkMinimized';

// First item from each navigation group for minimized mode
const minimizedNavigation = [
  // Tools - Show all tools as they're important
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Files', href: '/admin/files', icon: FileText },
  { name: 'Web Scraper', href: '/admin/scraper', icon: Search },
  { name: 'Support', href: '/admin/support', icon: LifeBuoy },
  { name: 'Help Center', href: '/admin/help', icon: HelpCircle },
  { name: 'Documentation', href: '/admin/docs', icon: BookOpen },
  { name: 'Feedback', href: '/admin/feedback', icon: MessageSquare },

  // Political - First item only
  { name: 'Politicians', href: '/admin/politicians', icon: Landmark },

  // Geographic - First item only
  { name: 'Regions', href: '/admin/regions', icon: MapPin },

  // Demographics - First item only
  { name: 'Demographics', href: '/admin/demographics', icon: PieChart },

  // Analytics - First item only
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },

  // System - First item only
  { name: 'Security', href: '/admin/security', icon: Settings },
];

export default function SidebarNavigationMinimized() {
  return (
    <nav className="flex flex-col px-2 py-2">
      <ul role="list" className="flex flex-col gap-y-2">
        {/* All navigation items as single list */}
        {minimizedNavigation.map((item) => (
          <li key={item.name}>
            <SidebarNavLinkMinimized item={item} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
