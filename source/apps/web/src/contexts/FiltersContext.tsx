'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { GetFilesQuery } from '@/app/admin/storage/types/request';
import { updateURL } from '@/lib/files/filters';

interface FiltersContextType {
  filters: Partial<GetFilesQuery>;
  viewMode: 'table' | 'grid';
  updateFilters: (newFilters: Partial<GetFilesQuery>) => void;
  updateViewMode: (viewMode: 'table' | 'grid') => void;
  clearAllFilters: () => void;
  activeFilterCount: number;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

interface FiltersProviderProps {
  children: ReactNode;
  initialFilters?: Partial<GetFilesQuery>;
}

export function FiltersProvider({ children, initialFilters }: FiltersProviderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize filters from URL params or props
  const [filters, setFilters] = useState<Partial<GetFilesQuery>>({
    search: initialFilters?.search || searchParams.get('search') || '',
    search_mode: initialFilters?.search_mode || (searchParams.get('search_mode') as GetFilesQuery['search_mode']) || 'contains',
    case_sensitive: initialFilters?.case_sensitive || searchParams.get('case_sensitive') === 'true',
    file_type_codes: initialFilters?.file_type_codes || searchParams.get('file_type_codes')?.split(',').filter(Boolean) || [],
    directory_ids: initialFilters?.directory_ids || searchParams.get('directory_ids')?.split(',').filter(Boolean) || [],
    content_types: initialFilters?.content_types || searchParams.get('content_types')?.split(',').filter(Boolean) || [],
    folder: initialFilters?.folder || searchParams.get('folder') || '',
    category: initialFilters?.category || searchParams.get('category') || '',
    size_min: initialFilters?.size_min || (searchParams.get('size_min') ? parseInt(searchParams.get('size_min')!) : undefined),
    size_max: initialFilters?.size_max || (searchParams.get('size_max') ? parseInt(searchParams.get('size_max')!) : undefined),
    date_from: initialFilters?.date_from || searchParams.get('date_from') || '',
    date_to: initialFilters?.date_to || searchParams.get('date_to') || '',
    sort_field: initialFilters?.sort_field || (searchParams.get('sort_field') as GetFilesQuery['sort_field']) || 'filename',
    sort_order: initialFilters?.sort_order || (searchParams.get('sort_order') as GetFilesQuery['sort_order']) || 'asc',
    limit: initialFilters?.limit || (searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20),
    offset: initialFilters?.offset || (searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0),
  });

  // Initialize view mode from URL params
  const [viewMode, setViewMode] = useState<'table' | 'grid'>((searchParams.get('viewMode') as 'table' | 'grid') || 'table');

  const updateFilters = (newFilters: Partial<GetFilesQuery>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    updateURL(newFilters, searchParams, router, pathname);
  };

  const updateViewMode = (newViewMode: 'table' | 'grid') => {
    setViewMode(newViewMode);
    updateURL({ viewMode: newViewMode }, searchParams, router, pathname);
  };

  const clearAllFilters = () => {
    const clearedFilters: Partial<GetFilesQuery> = {
      search: '',
      search_mode: 'contains',
      case_sensitive: false,
      file_type_codes: [],
      directory_ids: [],
      content_types: [],
      folder: '',
      category: '',
      size_min: undefined,
      size_max: undefined,
      date_from: '',
      date_to: '',
      sort_field: 'filename',
      sort_order: 'asc',
      limit: 20,
      offset: 0,
    };
    setFilters(clearedFilters);
    setViewMode('table');

    // Clear all URL params
    const params = new URLSearchParams();
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const activeFilterCount = [
    filters.search,
    filters.file_type_codes?.length,
    filters.directory_ids?.length,
    filters.content_types?.length,
    filters.folder,
    filters.category,
    filters.size_min,
    filters.size_max,
    filters.date_from,
    filters.date_to,
  ].filter(Boolean).length;

  const value: FiltersContextType = {
    filters,
    viewMode,
    updateFilters,
    updateViewMode,
    clearAllFilters,
    activeFilterCount,
  };

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
}
