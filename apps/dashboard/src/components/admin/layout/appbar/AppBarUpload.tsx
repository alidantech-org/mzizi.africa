'use client';

import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export default function AppBarUpload() {
  return (
    <Button variant="ghost" size="sm">
      <Upload className="h-5 w-5" />
    </Button>
  );
}
