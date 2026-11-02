'use client';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Event {
  id: number;
  queryName: string;
  status: string;
  startTime: string;
  endTime: string;
  recordsFound: number;
  errors: number;
}

interface EventTableProps {
  events: Event[];
}

export default function EventTable({ events }: EventTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Success
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Warning
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return '-';
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-';
    const duration = Math.round((end.getTime() - start.getTime()) / 1000);
    return `${duration}s`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Query Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Records Found</TableHead>
            <TableHead>Errors</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.queryName}</TableCell>
              <TableCell>{getStatusBadge(event.status)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {event.startTime ? new Date(event.startTime).toLocaleString() : '-'}
              </TableCell>
              <TableCell className="text-sm">{formatDuration(event.startTime, event.endTime)}</TableCell>
              <TableCell>
                <Badge variant={event.recordsFound > 0 ? 'default' : 'secondary'}>{event.recordsFound?.toLocaleString() || '0'}</Badge>
              </TableCell>
              <TableCell>
                {event.errors > 0 ? <Badge variant="destructive">{event.errors}</Badge> : <Badge variant="secondary">0</Badge>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
