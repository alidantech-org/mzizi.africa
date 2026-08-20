'use client';

import { Button } from '@/components/ui/button';
import { User, ChevronDown } from 'lucide-react';

export default function SidebarUserSection() {
  return (
    <div className="border-t border-border py-1.5 px-2 shrink-0">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">Admin User</p>
          <p className="text-xs text-muted-foreground truncate">admin@katiba.co.ke</p>
        </div>
        <Button variant="ghost" size="sm">
          <ChevronDown className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
