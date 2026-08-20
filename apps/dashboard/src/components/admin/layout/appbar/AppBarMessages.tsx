'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MessageSquare } from 'lucide-react';

export default function AppBarMessages() {
  const messages = [
    { id: 1, sender: 'Jane Smith', message: 'Can you review the latest submission?', time: '15 min ago', unread: true },
    { id: 2, sender: 'Support Team', message: 'Issue resolved', time: '4 hours ago', unread: false },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <MessageSquare className="h-5 w-5" />
          {messages.some((m) => m.unread) && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Messages</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`p-3 rounded-lg border ${msg.unread ? 'bg-accent/50' : ''}`}>
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{msg.sender}</p>
                <span className="text-xs text-muted-foreground">{msg.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{msg.message}</p>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
