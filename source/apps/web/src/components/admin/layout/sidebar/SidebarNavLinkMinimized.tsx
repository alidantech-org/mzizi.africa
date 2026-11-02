'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarNavLinkMinimizedProps {
  item: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  };
}

export default function SidebarNavLinkMinimized({ item }: SidebarNavLinkMinimizedProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={cn(
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground',
        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200 justify-center',
      )}
      title={item.name}
    >
      <item.icon className="h-5 w-5 shrink-0" />
    </Link>
  );
}
