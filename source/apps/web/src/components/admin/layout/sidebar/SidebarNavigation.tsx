'use client';

import { useMemo, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Landmark,
  MapPin,
  PieChart,
  BarChart3,
  Settings,
  Home,
  FileText,
  Search,
  Globe,
  Map,
  Building,
  Trees,
  MapPinned,
  Navigation,
} from 'lucide-react';
import SidebarNavGroup from './SidebarNavGroup';
import SidebarNavLink from './SidebarNavLink';

// Navigation configurations
const politicalNavigation = [
  { name: 'Politicians', href: '/admin/politicians', icon: Landmark },
  { name: 'Political Parties', href: '/admin/parties', icon: Landmark },
  { name: 'Leaders', href: '/admin/leaders', icon: Landmark },
  { name: 'Elections', href: '/admin/elections', icon: Landmark },
];

const geographicNavigation = [
  { name: 'Country', href: '/admin/countries', icon: Globe },
  { name: 'County', href: '/admin/counties', icon: Map },
  { name: 'Constituency', href: '/admin/constituencies', icon: Building },
  { name: 'Ward', href: '/admin/wards', icon: Trees },
  { name: 'Location', href: '/admin/locations', icon: MapPinned },
  { name: 'Sub-location', href: '/admin/sub-locations', icon: Navigation },
];

const demographicsNavigation = [
  { name: 'Demographics', href: '/admin/demographics', icon: PieChart },
  { name: 'Statistics', href: '/admin/statistics', icon: PieChart },
  { name: 'Population Data', href: '/admin/population', icon: PieChart },
];

const analyticsNavigation = [
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Data Hub', href: '/admin/datahub', icon: BarChart3 },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
];

const systemNavigation = [
  { name: 'Security', href: '/admin/security', icon: Settings },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

const toolsNavigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'File Storage', href: '/admin/storage', icon: FileText },
  { name: 'Web Scraper', href: '/admin/scraper', icon: Search },
];

interface SidebarNavigationProps {
  searchQuery: string;
  politicalOpen: boolean;
  setPoliticalOpen: (open: boolean) => void;
  geographicOpen: boolean;
  setGeographicOpen: (open: boolean) => void;
  demographicsOpen: boolean;
  setDemographicsOpen: (open: boolean) => void;
  analyticsOpen: boolean;
  setAnalyticsOpen: (open: boolean) => void;
  systemOpen: boolean;
  setSystemOpen: (open: boolean) => void;
}

export default function SidebarNavigation({
  searchQuery,
  politicalOpen,
  setPoliticalOpen,
  geographicOpen,
  setGeographicOpen,
  demographicsOpen,
  setDemographicsOpen,
  analyticsOpen,
  setAnalyticsOpen,
  systemOpen,
  setSystemOpen,
}: SidebarNavigationProps) {
  const pathname = usePathname();

  const allNavItems = useMemo(
    () => [
      ...geographicNavigation,

      ...politicalNavigation,
      ...demographicsNavigation,
      ...analyticsNavigation,
      ...systemNavigation,
      ...toolsNavigation,
    ],
    [],
  );

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return allNavItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, allNavItems]);

  // Auto-expand groups when they contain the active page (only on initial load or when navigating)
  useEffect(() => {
    const hasActivePolitical = politicalNavigation.some((item) => pathname === item.href);
    const hasActiveGeographic = geographicNavigation.some((item) => pathname === item.href);
    const hasActiveDemographics = demographicsNavigation.some((item) => pathname === item.href);
    const hasActiveAnalytics = analyticsNavigation.some((item) => pathname === item.href);
    const hasActiveSystem = systemNavigation.some((item) => pathname === item.href);

    // Only auto-expand if the group is currently closed and has active child
    // This allows manual control after initial auto-expansion
    if (hasActivePolitical && politicalOpen === false) setPoliticalOpen(true);
    if (hasActiveGeographic && geographicOpen === false) setGeographicOpen(true);
    if (hasActiveDemographics && demographicsOpen === false) setDemographicsOpen(true);
    if (hasActiveAnalytics && analyticsOpen === false) setAnalyticsOpen(true);
    if (hasActiveSystem && systemOpen === false) setSystemOpen(true);
  }, [pathname]);

  return (
    <nav className="flex flex-col py-2">
      <ul role="list" className="flex flex-col gap-y-2">
        {/* Search Results */}
        {filteredItems ? (
          <li>
            <div className="text-xs font-semibold text-muted-foreground mb-2">Search Results ({filteredItems.length})</div>
            <ul role="list" className="-mx-2 space-y-1">
              {filteredItems.map((item) => (
                <li key={item.name}>
                  <SidebarNavLink item={item} />
                </li>
              ))}
              {filteredItems.length === 0 && <li className="text-sm text-muted-foreground p-2">No results found</li>}
            </ul>
          </li>
        ) : (
          <>
            {/* Tools Section */}
            <li className="border-b-2 border-border pb-2 px-2">
              <div className="space-y-1">
                {toolsNavigation.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <div key={item.name}>
                      <SidebarNavLink item={item} />
                    </div>
                  );
                })}
              </div>
            </li>{' '}
            {/* Geographic Group */}
            <li className="px-2">
              <SidebarNavGroup
                title="Geographic"
                items={geographicNavigation}
                isOpen={geographicOpen}
                onToggle={() => setGeographicOpen(!geographicOpen)}
                icon={MapPin}
              />
            </li>
            {/* Political Group */}
            <li className="px-2">
              <SidebarNavGroup
                title="Political"
                items={politicalNavigation}
                isOpen={politicalOpen}
                onToggle={() => setPoliticalOpen(!politicalOpen)}
                icon={Landmark}
              />
            </li>
            {/* Demographics Group */}
            <li className="px-2">
              <SidebarNavGroup
                title="Demographics"
                items={demographicsNavigation}
                isOpen={demographicsOpen}
                onToggle={() => setDemographicsOpen(!demographicsOpen)}
                icon={PieChart}
              />
            </li>
            {/* Analytics Group */}
            <li className="px-2">
              <SidebarNavGroup
                title="Analytics & Data"
                items={analyticsNavigation}
                isOpen={analyticsOpen}
                onToggle={() => setAnalyticsOpen(!analyticsOpen)}
                icon={BarChart3}
              />
            </li>
            {/* System Group */}
            <li className="px-2">
              <SidebarNavGroup
                title="System"
                items={systemNavigation}
                isOpen={systemOpen}
                onToggle={() => setSystemOpen(!systemOpen)}
                icon={Settings}
              />
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
