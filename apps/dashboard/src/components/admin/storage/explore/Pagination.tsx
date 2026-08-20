'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFilters } from '@/contexts/FiltersContext';
import { Card } from '@/components/ui/card';

interface PaginationProps {
  pagination: {
    total: number;
    page: number;
    limit: number;
    offset?: number;
    totalPages: number;
  };
}

export default function Pagination({ pagination }: PaginationProps) {
  const { updateFilters } = useFilters();

  const handlePageChange = (newPage: number) => {
    updateFilters({ offset: newPage * pagination.limit });
  };

  const handleLimitChange = (newLimit: string) => {
    const limit = parseInt(newLimit);
    updateFilters({ limit, offset: 0 }); // Reset to first page when changing limit
  };

  const currentPage = Math.floor((pagination.offset || 0) / pagination.limit);
  const hasNextPage = currentPage < pagination.totalPages - 1;
  const hasPrevPage = currentPage > 0;

  return (
    <Card className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">
          Showing {Math.min(currentPage * pagination.limit + 1, pagination.total)} to{' '}
          {Math.min((currentPage + 1) * pagination.limit, pagination.total)} of {pagination.total} results
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Items per page:</span>
          <Select value={pagination.limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-[80px]" size='sm'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-1">
          <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={!hasPrevPage}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNumber;
              if (pagination.totalPages <= 5) {
                pageNumber = i;
              } else if (currentPage <= 2) {
                pageNumber = i;
              } else if (currentPage >= pagination.totalPages - 3) {
                pageNumber = pagination.totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber)}
                  className="w-8 h-8 p-0"
                >
                  {pageNumber + 1}
                </Button>
              );
            })}
          </div>

          <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={!hasNextPage}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
