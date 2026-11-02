'use client';
import { Menu } from 'lucide-react';

interface SidebarTriggerProps {
  onClick: () => void;
  className?: string;
}

export default function SidebarTrigger({ onClick, className }: SidebarTriggerProps) {
  return (
    <button className={className} onClick={onClick}>
      <Menu className="h-6 w-6" />
    </button>
  );
}
