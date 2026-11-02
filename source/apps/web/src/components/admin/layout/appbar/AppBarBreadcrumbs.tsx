'use client';

import { usePathname } from 'next/navigation';
import { Slash } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AppBarBreadcrumbs() {
  const pathname = usePathname();

  // Don't show breadcrumbs on the main dashboard
  if (pathname === '/admin' || pathname === '/admin/') {
    return 'Dashboard';
  }

  // Generate breadcrumb items from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      label,
      href,
      isLast: index === pathSegments.length - 1,
    };
  });

  // Filter out 'admin' from breadcrumbs
  const filteredBreadcrumbs = breadcrumbs.filter((breadcrumb) => breadcrumb.label.toLowerCase() !== 'admin');

  // Summarize long paths: if more than 4 segments, show first + "..." + last 3
  let displayBreadcrumbs = filteredBreadcrumbs;
  if (filteredBreadcrumbs.length > 4) {
    const first = filteredBreadcrumbs[0];
    const lastThree = filteredBreadcrumbs.slice(-3);
    displayBreadcrumbs = [first, { label: '...', href: '#', isLast: false }, ...lastThree];
  }

  if (displayBreadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-muted-foreground">
      <Link href="/admin" className="transition-colors hover:text-foreground">
        Dashboard
      </Link>
      {displayBreadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center space-x-1">
          <Slash className="h-4 w-4 font-bold rotate-150" />
          {breadcrumb.isLast ? (
            <span className="font-medium text-foreground">{breadcrumb.label}</span>
          ) : breadcrumb.label === '...' ? (
            <span className="text-muted-foreground">{breadcrumb.label}</span>
          ) : (
            <Link href={breadcrumb.href} className={cn('transition-colors hover:text-foreground', index === 0 && 'text-muted-foreground')}>
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
