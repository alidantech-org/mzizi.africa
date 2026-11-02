import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Download } from 'lucide-react';
import { getFileIcon } from '@/lib/files/files';
import { FileType } from '@/app/admin/storage/types/file-type';

// Extended interface for file types with statistics
interface FileTypeWithStats extends FileType {
  file_count?: number;
  total_size_bytes?: number;
}

interface FileTypeBrowserProps {
  fileTypes: FileTypeWithStats[];
  viewMode: string;
}

export default function FileTypeBrowser({ fileTypes, viewMode }: FileTypeBrowserProps) {
  const getFileIconForType = (fileType: FileTypeWithStats) => {
    return getFileIcon(fileType.code || fileType.name || 'file');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  // Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {fileTypes.map((fileType) => (
        <Card key={fileType.id} className="group p-2 gap-2 cursor-pointer hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <div className="aspect-square relative bg-muted/20">
            <Avatar className="w-full h-full rounded-none">
              <AvatarFallback className="w-full h-full rounded-lg border overflow-hidden object-cover">
                {getFileIconForType(fileType)}
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
            <div className="text-sm font-medium truncate" title={fileType.name}>
              {fileType.name}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{fileType.code}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">{formatNumber(fileType.file_count || 0)} files</span>
              <Badge variant="secondary" className="text-xs">
                {formatFileSize(fileType.total_size_bytes || 0)}
              </Badge>
            </div>
          </div>
        </Card>
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
              <TableHead>Code</TableHead>
              <TableHead>Files</TableHead>
              <TableHead>Total Size</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fileTypes.map((fileType) => (
              <TableRow key={fileType.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>{getFileIconForType(fileType)}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium truncate max-w-[200px]" title={fileType.name}>
                      {fileType.name}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {fileType.code}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatNumber(fileType.file_count || 0)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatFileSize(fileType.total_size_bytes || 0)}</TableCell>
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
    <>
      {/* Files display */}
      {fileTypes.length === 0 ? (
        <Card className="p-8">
          <CardContent className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">{getFileIcon('file')}</div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No file types found</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  No file types are available. Try adjusting your search or upload some files to see file type statistics.
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
    </>
  );
}
