import { GetFilesQuery } from '@/app/admin/storage/types/request';

// Update URL when filters change
export const updateURL = (newFilters: Partial<GetFilesQuery> & { viewMode?: string }, searchParams: any, router: any, pathname: string) => {
  const params = new URLSearchParams(searchParams);

  // Update search params
  if (newFilters.search !== undefined) {
    if (newFilters.search) {
      params.set('search', newFilters.search);
    } else {
      params.delete('search');
    }
  }

  if (newFilters.limit !== undefined) {
    if (newFilters.limit && newFilters.limit !== 20) {
      params.set('limit', newFilters.limit.toString());
    } else {
      params.delete('limit');
    }
  }

  if (newFilters.offset !== undefined) {
    if (newFilters.offset && newFilters.offset !== 0) {
      params.set('offset', newFilters.offset.toString());
    } else {
      params.delete('offset');
    }
  }

  if (newFilters.viewMode !== undefined) {
    if (newFilters.viewMode) {
      params.set('viewMode', newFilters.viewMode);
    } else {
      params.delete('viewMode');
    }
  }

  if (newFilters.search_mode !== undefined) {
    if (newFilters.search_mode) {
      params.set('search_mode', newFilters.search_mode);
    } else {
      params.delete('search_mode');
    }
  }

  if (newFilters.case_sensitive !== undefined) {
    if (newFilters.case_sensitive) {
      params.set('case_sensitive', 'true');
    } else {
      params.delete('case_sensitive');
    }
  }

  // Update array filters
  if (newFilters.file_type_codes !== undefined) {
    if (newFilters.file_type_codes && newFilters.file_type_codes.length > 0) {
      params.set('file_type_codes', newFilters.file_type_codes.join(','));
    } else {
      params.delete('file_type_codes');
    }
  }

  if (newFilters.directory_ids !== undefined) {
    if (newFilters.directory_ids && newFilters.directory_ids.length > 0) {
      params.set('directory_ids', newFilters.directory_ids.join(','));
    } else {
      params.delete('directory_ids');
    }
  }

  if (newFilters.content_types !== undefined) {
    if (newFilters.content_types && newFilters.content_types.length > 0) {
      params.set('content_types', newFilters.content_types.join(','));
    } else {
      params.delete('content_types');
    }
  }

  // Update string filters
  if (newFilters.folder !== undefined) {
    if (newFilters.folder) {
      params.set('folder', newFilters.folder);
    } else {
      params.delete('folder');
    }
  }

  if (newFilters.category !== undefined) {
    if (newFilters.category && newFilters.category !== 'all') {
      params.set('category', newFilters.category);
    } else {
      params.delete('category');
    }
  }

  // Update numeric filters
  if (newFilters.size_min !== undefined) {
    if (newFilters.size_min !== undefined) {
      params.set('size_min', newFilters.size_min.toString());
    } else {
      params.delete('size_min');
    }
  }

  if (newFilters.size_max !== undefined) {
    if (newFilters.size_max !== undefined) {
      params.set('size_max', newFilters.size_max.toString());
    } else {
      params.delete('size_max');
    }
  }

  // Update date filters
  if (newFilters.date_from !== undefined) {
    if (newFilters.date_from) {
      params.set('date_from', newFilters.date_from);
    } else {
      params.delete('date_from');
    }
  }

  if (newFilters.date_to !== undefined) {
    if (newFilters.date_to) {
      params.set('date_to', newFilters.date_to);
    } else {
      params.delete('date_to');
    }
  }

  // Update sort params
  if (newFilters.sort_field !== undefined) {
    if (newFilters.sort_field) {
      params.set('sort_field', newFilters.sort_field);
    } else {
      params.delete('sort_field');
    }
  }

  if (newFilters.sort_order !== undefined) {
    if (newFilters.sort_order) {
      params.set('sort_order', newFilters.sort_order);
    } else {
      params.delete('sort_order');
    }
  }

  // Update URL without page reload
  router.replace(`${pathname}?${params.toString()}`, { scroll: false });
};
