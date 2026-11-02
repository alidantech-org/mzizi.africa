'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, subMonths } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { FolderOpen, File, HardDrive, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface AnalyticsFiltersProps {
  folderOptions: string[];
  fileCategories: string[];
  sizeRangeOptions: Array<{ range: string }>;
}

export default function AnalyticsFilters({ folderOptions, fileCategories, sizeRangeOptions }: AnalyticsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL params
  const [selectedFolder, setSelectedFolder] = useState(searchParams.get('folder') || 'all');
  const [selectedFileType, setSelectedFileType] = useState(searchParams.get('file_type') || 'all');
  const [selectedSizeRange, setSelectedSizeRange] = useState(searchParams.get('size_range') || 'all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: searchParams.get('date_from') ? new Date(searchParams.get('date_from')!) : subMonths(new Date(), 2),
    to: searchParams.get('date_to') ? new Date(searchParams.get('date_to')!) : new Date(),
  });

  // Update URL when filters change
  const updateFilters = () => {
    const params = new URLSearchParams();

    if (selectedFolder && selectedFolder !== 'all') {
      params.set('folder', selectedFolder);
    }
    if (selectedFileType && selectedFileType !== 'all') {
      params.set('file_type', selectedFileType);
    }
    if (selectedSizeRange && selectedSizeRange !== 'all') {
      params.set('size_range', selectedSizeRange);
    }
    if (dateRange?.from) {
      params.set('date_from', dateRange.from.toISOString().split('T')[0]);
    }
    if (dateRange?.to) {
      params.set('date_to', dateRange.to.toISOString().split('T')[0]);
    }

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : '');
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedFolder('all');
    setSelectedFileType('all');
    setSelectedSizeRange('all');
    setDateRange({
      from: subMonths(new Date(), 2),
      to: new Date(),
    });
    router.push('');
  };

  // Auto-update URL when filters change
  useEffect(() => {
    const timeoutId = setTimeout(updateFilters, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedFolder, selectedFileType, selectedSizeRange, dateRange]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
      <Select value={selectedFolder} onValueChange={setSelectedFolder}>
        <SelectTrigger className="w-full">
          <FolderOpen className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Select folder" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Folders</SelectItem>
          {folderOptions.map((folder) => (
            <SelectItem key={folder} value={folder.toLowerCase()}>
              {folder}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedFileType} onValueChange={setSelectedFileType}>
        <SelectTrigger className="w-full">
          <File className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {fileCategories.map((type) => (
            <SelectItem key={type} value={type.toLowerCase()}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedSizeRange} onValueChange={setSelectedSizeRange}>
        <SelectTrigger className="w-full">
          <HardDrive className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Select size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sizes</SelectItem>
          {sizeRangeOptions.map((size) => (
            <SelectItem key={size.range} value={size.range}>
              {size.range}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full border border-border bg-card justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd')}
                </>
              ) : (
                format(dateRange.from, 'MMM dd, y')
              )
            ) : (
              <span>Date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <Button onClick={resetFilters} variant="outline" className="w-full bg-card">
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset
      </Button>
      <Link href="/admin/storage/explore" passHref>
        <Button className="w-full">Explore</Button>
      </Link>
    </div>
  );
}
