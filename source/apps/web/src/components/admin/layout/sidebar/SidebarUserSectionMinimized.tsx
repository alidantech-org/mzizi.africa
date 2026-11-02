'use client';

import { User } from 'lucide-react';

export default function SidebarUserSectionMinimized() {
  return (
    <div className="border-t-2 border-border py-3 shrink-0 flex justify-center">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
        <User className="h-5 w-5 text-primary" />
      </div>
    </div>
  );
}
