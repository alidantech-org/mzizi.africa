'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: {
    page: number;
    size: number;
    total: number;
    pages: number;
    onPageChange: (page: number) => void;
    onSizeChange: (size: number) => void;
  };
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  filters?: Record<string, string>;
  onFiltersChange?: (filters: Record<string, string>) => void;
}

export function DataTable<T>({ data, columns, loading = false, pagination, search, filters, onFiltersChange }: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSort = (columnKey: string) => {
    if (sortConfig?.key === columnKey) {
      setSortConfig({
        key: columnKey,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSortConfig({ key: columnKey, direction: 'asc' });
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key as keyof T];
    const bValue = b[sortConfig.key as keyof T];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter((item) => {
    // Apply search filter
    if (search?.value) {
      const searchLower = search.value.toLowerCase();
      const searchableColumns = columns.filter((col) => col.filterable);
      const matchesSearch = searchableColumns.some((col) => {
        const value = item[col.key as keyof T];
        return value && String(value).toLowerCase().includes(searchLower);
      });
      if (!matchesSearch) return false;
    }

    // Apply other filters
    if (filters) {
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true; // Empty filter means no filtering
        const itemValue = item[key as keyof T];
        return String(itemValue).toLowerCase().includes(value.toLowerCase());
      });
      if (!matchesFilters) return false;
    }

    return true;
  });

  const paginatedData = pagination
    ? filteredData.slice((pagination.page - 1) * pagination.size, pagination.page * pagination.size)
    : filteredData;

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {search && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={search.placeholder || 'Search...'}
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {filters && onFiltersChange && (
          <div className="flex gap-2">
            {Object.entries(filters).map(([key, value]) => (
              <Input
                key={key}
                placeholder={`Filter by ${key}`}
                value={value}
                onChange={(e) => onFiltersChange({ ...filters, [key]: e.target.value })}
                className="w-32"
              />
            ))}
          </div>
        )}

        {pagination && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing {paginatedData.length} of {filteredData.length} results
            </span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>
                  <div className="flex items-center space-x-2">
                    {column.sortable && (
                      <Button variant="ghost" size="sm" onClick={() => handleSort(column.key)}>
                        {column.label}
                        {sortConfig?.key === column.key && <span className="ml-2">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>}
                      </Button>
                    )}
                    {!column.sortable && column.label}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary border-t-transparent"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>{column.render(item)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.pages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <select
              value={pagination.size}
              onChange={(e) => pagination.onSizeChange(Number(e.target.value))}
              className="rounded border border-input bg-background px-3 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
