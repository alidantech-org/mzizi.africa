'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, X, Calendar, Folder, FileText } from 'lucide-react';
import { GetFilesQuery } from '@/app/admin/storage/types/request';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFilters } from '@/contexts/FiltersContext';

export interface FiltersSheetProps {
  folders: string[];
  directories: { id: string; name: string }[];
  fileTypeCodes: string[];
  categories: string[];
  contentTypes: string[];
  initialFilters: Partial<GetFilesQuery>;
}

export default function FiltersSheet({
  folders = [],
  fileTypeCodes = [],
  categories = [],
  contentTypes = [],
  directories = [],
  initialFilters,
}: FiltersSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { filters, viewMode, updateFilters, updateViewMode, clearAllFilters, activeFilterCount } = useFilters();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <>
          {/* Mobile: Icon-only button */}
          <Button variant="outline" size="icon" className="relative hidden bg-card md:flex" onClick={() => setIsOpen(!isOpen)}>
            <Filter className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">{activeFilterCount}</Badge>
            )}
          </Button>

          {/* Desktop: Button with text */}
          <Button variant="outline" size="sm" className="relative bg-card  md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">{activeFilterCount}</Badge>
            )}
          </Button>
        </>
      </SheetTrigger>
      <SheetContent className="w-full flex flex-col border-transparent md:border-border md:w-96 p-0 gap-0">
        <SheetHeader className="border-b h-[9vh]">
          <SheetTitle>File Filters</SheetTitle>
          <SheetDescription className="hidden">Customize your file type view with advanced filters</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[81vh]">
          <div className="space-y-4 flex flex-col py-6 px-4">
            {/* Search Options */}
            <div className="space-y-3">
              <h4 className="font-medium">Search Options</h4>
              <div className="space-y-2">
                <Input
                  placeholder="Search files..."
                  value={filters.search || ''}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  className="bg-card"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={filters.search_mode || undefined}
                    onValueChange={(value) => updateFilters({ search_mode: value as GetFilesQuery['search_mode'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="exact">Exact</SelectItem>
                      <SelectItem value="starts_with">Starts With</SelectItem>
                      <SelectItem value="ends_with">Ends With</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="case-sensitive"
                      checked={filters.case_sensitive || false}
                      onCheckedChange={(checked) => updateFilters({ case_sensitive: checked as boolean })}
                    />
                    <label htmlFor="case-sensitive" className="text-sm">
                      Case Sensitive
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="space-y-3">
              <h4 className="font-medium">Sort By</h4>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={filters.sort_field || undefined}
                  onValueChange={(value) => updateFilters({ sort_field: value as GetFilesQuery['sort_field'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
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

                <Select
                  value={filters.sort_order || undefined}
                  onValueChange={(value) => updateFilters({ sort_order: value as GetFilesQuery['sort_order'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* View Mode Selection */}
            <div className="space-y-3">
              <h4 className="font-medium">View Mode</h4>
              <Select value={viewMode} onValueChange={updateViewMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Table View</SelectItem>
                  <SelectItem value="grid">Grid View</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* File Type Selection */}
            <div className="grid grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-medium">File Types</h4>
                <Select
                  value={filters.file_type_codes?.[0] || 'all'}
                  onValueChange={(value) => {
                    if (value === 'all') {
                      updateFilters({ file_type_codes: [] });
                    } else {
                      updateFilters({ file_type_codes: [value] });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select file type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All File Types</SelectItem>
                    {fileTypeCodes.map((code) => (
                      <SelectItem key={code} value={code}>
                        <span className="capitalize">{code}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Folder Pattern */}
              {/* Folder Selection */}
              {folders.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Folders</h4>
                  <Select
                    value={filters.folder?.[0] || 'all'}
                    onValueChange={(value) => {
                      if (value === 'all') {
                        updateFilters({ folder: undefined });
                      } else {
                        updateFilters({ folder: value });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select folder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Folders</SelectItem>
                      {folders.map((folder) => (
                        <SelectItem key={folder} value={folder}>
                          {folder}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2">
              {/* Content Types */}
              {contentTypes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Content Types</h4>
                  <Select
                    value={filters.content_types?.[0] || 'all'}
                    onValueChange={(value) => {
                      if (value === 'all') {
                        updateFilters({ content_types: [] });
                      } else {
                        updateFilters({ content_types: [value] });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Content Types</SelectItem>
                      {contentTypes.map((contentType) => (
                        <SelectItem key={contentType} value={contentType}>
                          {contentType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Category Selection */}
              {categories.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Categories</h4>
                  <Select value={filters.category || undefined} onValueChange={(value) => updateFilters({ category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Size Range */}
            <div className="space-y-3">
              <h4 className="font-medium">Size Range (bytes)</h4>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min size"
                  value={filters.size_min || ''}
                  onChange={(e) => updateFilters({ size_min: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="bg-card"
                />
                <Input
                  type="number"
                  placeholder="Max size"
                  value={filters.size_max || ''}
                  onChange={(e) => updateFilters({ size_max: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="bg-card"
                />
              </div>
            </div>

            {/* Folder Selection */}
            {directories.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Match Directories</h4>
                <Select
                  value={filters.directory_ids?.[0] || 'all'}
                  onValueChange={(value) => {
                    if (value === 'all') {
                      updateFilters({ directory_ids: [] });
                    } else {
                      updateFilters({ directory_ids: [...(filters.directory_ids || []), value] });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Directories</SelectItem>
                    {directories.map((directory) => (
                      <SelectItem key={directory.id} value={directory.id}>
                        {directory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Date Range */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="datetime-local"
                  placeholder="From date"
                  value={filters.date_from || ''}
                  onChange={(e) => updateFilters({ date_from: e.target.value })}
                  className="bg-card"
                />
                <Input
                  type="datetime-local"
                  placeholder="To date"
                  value={filters.date_to || ''}
                  onChange={(e) => updateFilters({ date_to: e.target.value })}
                  className="bg-card"
                />
              </div>
            </div>
          </div>
        </ScrollArea>
        <SheetFooter className="bg-card h-[10vh] border-t px-4">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={clearAllFilters} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button onClick={() => setIsOpen(false)} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
