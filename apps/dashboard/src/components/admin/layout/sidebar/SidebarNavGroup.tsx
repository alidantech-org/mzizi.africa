'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import SidebarNavLink from './SidebarNavLink';

interface SidebarNavGroupProps {
  title: string;
  items: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  isOpen: boolean;
  onToggle: () => void;
  icon: React.ComponentType<{ className?: string }>;
}

export default function SidebarNavGroup({ title, items, isOpen, onToggle, icon: Icon }: SidebarNavGroupProps) {
  const pathname = usePathname();
  const hasActiveChild = items.some((item) => pathname === item.href);

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger
        className={cn(
          'flex w-full text-muted-foreground items-center border justify-between rounded-md p-2 text-sm font-semibold transition-all duration-200',
          hasActiveChild && !isOpen && 'bg-primary text-white border-primary',
          isOpen && 'bg-muted/50 text-foreground border-primary',
          'hover:bg-accent hover:text-accent-foreground',
        )}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span>{title}</span>
        </div>
        <ChevronDown className={cn('h-4 w-4 transition-transform duration-200')} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-3 border-l space-y-1 mt-1">
        <ul className="space-y-1 mt-1">
          {items.map((item) => (
            <li key={item.name}>
              <SidebarNavLink item={item} />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
