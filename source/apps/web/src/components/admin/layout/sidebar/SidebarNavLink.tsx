'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarNavLinkProps {
  item: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  };
}

export default function SidebarNavLink({ item }: SidebarNavLinkProps) {
  const pathname = usePathname();
  const isActive = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={cn(
        isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200',
      )}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {item.name}
    </Link>
  );
}
