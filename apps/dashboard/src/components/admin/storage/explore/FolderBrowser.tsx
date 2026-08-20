'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { FolderOpen, Eye, Download, ChevronRight, Home } from 'lucide-react';
import { Folder } from '@/app/admin/storage/types/folder';
import Link from 'next/link';

interface FolderBrowserProps {
  folders: Folder[];
  viewMode: string;
  segments: string[];
  depth: number;
}

export default function FolderBrowser({ folders, viewMode, segments, depth }: FolderBrowserProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  // Navigation Breadcrumb Component
  const NavigationBreadcrumb = () => (
    <Card className="p-0">
      <CardContent className="p-2 rounded-sm flex justify-between items-center">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/storage/explore/folders" className="cursor-pointer">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {segments.slice(1).map((segment, index) => (
            <BreadcrumbItem key={index}>
              <ChevronRight className="h-4 w-4 mx-2" />
              <BreadcrumbLink asChild>
                <Link href={`/admin/storage/explore/folders/${segments.slice(1, index + 2).join('/')}`} className="cursor-pointer">
                  {segment}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
        <div className="text-sm">Total {folders.length}</div>
      </CardContent>
    </Card>
  );

  // Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {folders.map((folder) => (
        <Link key={folder.id} href={`/admin/storage/explore/folders/${folder.path}`} className="block">
          <Card className="group p-2 gap-2 cursor-pointer hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="aspect-square relative bg-muted/20">
              <Avatar className="w-full h-full rounded-none">
                <AvatarFallback className="w-full h-full rounded-lg border overflow-hidden object-cover">
                  <FolderOpen className="h-8 w-8 text-blue-500" />
                </AvatarFallback>
              </Avatar>

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-3">
              <div className="text-sm font-medium truncate" title={folder.name}>
                {folder.name}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{folder.path}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">{formatNumber(folder.file_count)} files</span>
                <Badge variant="secondary" className="text-xs">
                  {formatFileSize(folder.total_size_bytes)}
                </Badge>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );

  // Table View Component
  const TableView = () => (
    <Card className="p-0">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Path</TableHead>
              <TableHead>Files</TableHead>
              <TableHead>Total Size</TableHead>
              <TableHead>Modified</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {folders.map((folder) => (
              <TableRow key={folder.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <Link href={`/admin/storage/explore/folders/${folder.path}`} className="flex items-center">
                    <FolderOpen className="h-4 w-4 text-blue-500" />
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/admin/storage/explore/folders/${folder.path}`}>
                    <div className="font-medium truncate max-w-[200px]" title={folder.name}>
                      {folder.name}
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {folder.path}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatNumber(folder.file_count)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatFileSize(folder.total_size_bytes)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(folder.updated_at || folder.created_at)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-2">
      {/* Navigation Breadcrumb */}
      <NavigationBreadcrumb />

      {/* Folders display */}
      {folders.length === 0 ? (
        <Card className="p-8">
          <CardContent className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                <FolderOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No folders found</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  No folders are available in this location. Try adjusting your search or navigate to a different directory.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <GridView />
      ) : (
        <TableView />
      )}
    </div>
  );
}
