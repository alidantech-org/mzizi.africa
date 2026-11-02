'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GetFilesQuery } from '@/app/admin/storage/types/request';
import { useFilters } from '@/contexts/FiltersContext';

export interface ExploreItemsProps {
  folders?: string[];
  fileTypeCodes?: string[];
  categories?: string[];
  contentTypes?: string[];
  onFiltersChange?: (filters: Partial<GetFilesQuery>) => void;
  initialFilters?: Partial<GetFilesQuery>;
}

export const SearchItem = ({ searchFor = 'files' }) => {
  const { filters, updateFilters } = useFilters();

  return (
    <div className="relative flex-1 min-w-0">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
      <Input
        placeholder={`Search ${searchFor ? searchFor.split('-').join(' ') : 'files'}...`}
        value={filters.search || ''}
        onChange={(e) => updateFilters({ search: e.target.value })}
        className="pl-10 bg-card w-full"
      />
    </div>
  );
};

export const ViewTypeItem = () => {
  const { viewMode, updateViewMode } = useFilters();

  return (
    <Select value={viewMode} onValueChange={updateViewMode}>
      <SelectTrigger className="flex-1 min-w-[80px] md:w-[100px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="table">Table</SelectItem>
        <SelectItem value="grid">Grid</SelectItem>
      </SelectContent>
    </Select>
  );
};

export const SortItem = () => {
  const { filters, updateFilters } = useFilters();

  const toggleSortOrder = () => {
    const newOrder = filters.sort_order === 'asc' ? 'desc' : 'asc';
    updateFilters({ sort_order: newOrder });
  };

  return (
    <div className={cn('flex gap-2 min-w-0', 'md:hidden xl:flex')}>
      <Select
        value={filters.sort_field || undefined}
        onValueChange={(value) => updateFilters({ sort_field: value as GetFilesQuery['sort_field'] })}
      >
        <SelectTrigger className="flex-1 min-w-[120px] md:w-[140px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="filename">Name</SelectItem>
          <SelectItem value="createdAt">Created</SelectItem>
          <SelectItem value="updatedAt">Modified</SelectItem>
          <SelectItem value="size_bytes">Size</SelectItem>
          <SelectItem value="file_type_code">Type</SelectItem>
          <SelectItem value="directory_id">Folder</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon" onClick={toggleSortOrder} className="bg-card flex-shrink-0 w-[40px]">
        {filters.sort_order === 'asc' ? '↑' : '↓'}
      </Button>
    </div>
  );
};
