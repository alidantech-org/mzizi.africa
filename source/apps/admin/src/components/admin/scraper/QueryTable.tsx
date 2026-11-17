'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Play, Pause, Trash2, Edit, Globe, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { Query } from '@/app/admin/scraper/types';

interface QueryTableProps {
  queries: Query[];
  onEdit: (query: Query) => void;
  onDelete: (query: Query) => void;
  onRun: (query: Query) => void;
  onToggleStatus: (query: Query) => void;
}

export default function QueryTable({ queries, onEdit, onDelete, onRun, onToggleStatus }: QueryTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'paused':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Pause className="w-3 h-3 mr-1" />
            Paused
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Query Name</TableHead>
            <TableHead>Target URL</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Run</TableHead>
            <TableHead>Next Run</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queries.map((query) => (
            <TableRow key={query.id}>
              <TableCell className="font-medium">{query.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate max-w-[200px]" title={query.url}>
                    {query.url}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {query.frequency}
                </Badge>
              </TableCell>
              <TableCell>{getStatusBadge(query.status)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {query.lastRun || query.last_run || '-'}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {query.nextRun || query.next_run || '-'}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onToggleStatus(query)} className="h-8 w-8 p-0">
                    {query.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onRun(query)} className="h-8 w-8 p-0">
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(query)} className="h-8 w-8 p-0">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(query)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
