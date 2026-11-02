'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { FolderOpen, File, BarChart3, LucideDatabaseBackup } from 'lucide-react';

const tabs = [
  {
    name: 'Files',
    href: '/admin/storage/explore',
    icon: File,
  },
  {
    name: 'FileTypes',
    href: '/admin/storage/explore/file-types',
    icon: LucideDatabaseBackup,
  },
  {
    name: 'Folders',
    href: '/admin/storage/explore/folders',
    icon: FolderOpen,
  },
];

interface StorageTabsProps {
  className?: string;
}

export default function StorageTabs({ className }: StorageTabsProps) {
  const pathname = usePathname();

  return (
    <div className={cn('flex w-full border space-x-0.5 bg-card p-0.5 rounded-md md:w-fit', className)}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || (pathname.includes('folders') && tab.href.includes('folders'));
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex flex-1 items-center border border-transparent hover:border-border space-x-2 px-3 py-1 rounded-sm text-sm font-medium transition-colors',
              isActive
                ? 'bg-accent/70 text-primary-foreground shadow-sm'
                : 'text-muted-foreground bg-muted hover:text-foreground hover:bg-background/50',
            )}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
