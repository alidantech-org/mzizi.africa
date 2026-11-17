'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Bell } from 'lucide-react';

export default function AppBarNotifications() {
  const notifications = [
    { id: 1, title: 'New donation received', message: 'KES 50,000 from John Doe', time: '5 min ago', unread: true },
    { id: 2, title: 'Suspicious activity detected', message: 'Large transaction flagged for review', time: '1 hour ago', unread: true },
    { id: 3, title: 'Report generated', message: 'Monthly finance report is ready', time: '2 hours ago', unread: false },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.some((n) => n.unread) && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full border-2 border-background"></span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4 p-4">
          {notifications.map((notification) => (
            <div key={notification.id} className={`p-3 rounded-lg border ${notification.unread ? 'bg-accent/50' : ''}`}>
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{notification.title}</p>
                <span className="text-xs text-muted-foreground">{notification.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
