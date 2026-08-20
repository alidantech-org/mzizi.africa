'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Mail } from 'lucide-react';

export default function AppBarEmail() {
  const emails = [
    { id: 1, sender: 'IEBC', subject: 'Compliance Update Required', time: '10 min ago', unread: true },
    { id: 2, sender: 'Finance Team', subject: 'Q4 Budget Review', time: '3 hours ago', unread: true },
    { id: 3, sender: 'System', subject: 'Weekly Summary', time: '1 day ago', unread: false },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Mail className="h-5 w-5" />
          {emails.some((e) => e.unread) && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full border-2 border-background"></span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Emails</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {emails.map((email) => (
            <div key={email.id} className={`p-3 rounded-lg border ${email.unread ? 'bg-accent/50' : ''}`}>
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{email.sender}</p>
                <span className="text-xs text-muted-foreground">{email.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{email.subject}</p>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
