'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlertCircle } from 'lucide-react';

export default function AppBarAlerts() {
  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'High risk transaction',
      description: 'Transaction #12345 requires immediate review',
      time: '2 min ago',
    },
    { id: 2, type: 'info', title: 'System maintenance', description: 'Scheduled for tonight at 2 AM', time: '1 hour ago' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <AlertCircle className="h-5 w-5" />
          {alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-orange-500 rounded-full border-2 border-background"></span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Alerts</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{alert.title}</p>
                <span className="text-xs text-muted-foreground">{alert.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
