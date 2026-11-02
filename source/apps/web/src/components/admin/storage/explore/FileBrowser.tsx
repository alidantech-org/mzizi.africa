import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getFileIcon, getFileTypeDescription } from '@/lib/files/files';
import { Eye, FileText } from 'lucide-react';
import { FileRecord } from '@/app/admin/storage/types/file';
import { AvatarFallback, AvatarImage, Avatar } from '@/components/ui/avatar';
import FilePreviewDialog from '../files/FilePreviewDialog';
import { cn } from '@/lib/utils';
interface FileBrowserProps {
  files: FileRecord[];
  viewMode: string;
}

export default function FileBrowser({ files, viewMode }: FileBrowserProps) {
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {files.map((file) => (
        <Card key={file.id} className="group p-2 gap-2 cursor-pointer hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <div className="aspect-square relative bg-muted/20">
            <Avatar className="w-full h-full rounded-none">
              <AvatarImage
                src={file.public_url}
                alt={file.filename}
                className="w-full h-full rounded-lg border overflow-hidden object-cover"
              />
              <AvatarFallback className="w-full h-full rounded-none">No Preview</AvatarFallback>
            </Avatar>
            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <FilePreviewDialog file={file} />
            </div>
          </div>

          <div>
            <div className="text-sm font-medium truncate" title={file.filename}>
              {file.filename}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{getFileTypeDescription(file.file_type_code || '')}</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-muted-foreground">{formatFileSize(file.size_bytes)}</span>
              <Badge variant="secondary" className="text-xs">
                {file.file_type_code?.split('/')[0]?.toUpperCase() || 'FILE'}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  // Table View Component
  const TableView = () => (
    <Card className="p-0 hidden md:block">
      <CardContent className="py-2 px-2 space-y-2 gap-0 my-0">
        <Table className="border-none">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Modified</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id} className="cursor-pointer border-none hover:bg-muted/50">
                <TableCell className="w-[40px]">{getFileIcon(file.file_type_code || '')}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium truncate max-w-[200px]" title={file.filename}>
                      {file.filename}
                    </div>
                    {/* <div className="text-sm text-muted-foreground">{getFileTypeDescription(file.file_type_code || '')}</div> */}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {file.file_type_code?.split('/')[0]?.toUpperCase() || 'FILE'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatFileSize(file.size_bytes)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(file.created_at)}</TableCell>
                <TableCell>
                  <FilePreviewDialog file={file} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  // Compressed List View Component for mobile
  const ListView = () => (
    <Card className="p-0 md:hidden">
      <CardContent className="p-0">
        {files.map((file, index) => (
          <div
            key={file.id}
            className={cn('flex items-center gap-3 p-3 rounded-none hover:bg-muted/50 transition-colors cursor-pointer', {
              'border-t': index !== 0,
            })}
          >
            {/* File Icon */}
            <div className="flex-shrink-0 w-4 h-8">{getFileIcon(file.file_type_code || '')}</div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              {/* First Row - Name */}
              <div className="font-medium truncate" title={file.filename}>
                {file.filename}
              </div>

              {/* Second Row - Details */}
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  {file.file_type_code?.split('/')[0]?.toUpperCase() || 'FILE'}
                </Badge>
                <span>{formatFileSize(file.size_bytes)}</span>
                <span>{formatDate(file.created_at)}</span> <FilePreviewDialog file={file} />
              </div>
            </div>

            {/* Actions */}
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* Files display */}
      {files.length === 0 ? (
        <Card className="p-8">
          <CardContent className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No files found</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  No files are available in this location. Try adjusting your search terms or upload some files to get started.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile: Always use compressed list view */}
          <div className="md:hidden">{viewMode === 'table' ? <ListView /> : <GridView />}</div>

          {/* Desktop: Use grid or table view based on selection */}
          <div className="hidden md:block">{viewMode === 'grid' ? <GridView /> : <TableView />}</div>
        </>
      )}

      {/* Controlled dialog for selected file */}
    </>
  );
}
