'use client';

import { useState, useEffect } from 'react';
import { X, FileText, Code, MapPin, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileRecord } from '@/app/admin/storage/types/file';

interface FilePreviewDialogProps {
  file: FileRecord;
}

// Custom preview components
const ImagePreview = ({ src }: { src: string }) => (
  <div className="w-full h-full flex items-center justify-center bg-muted/20">
    <img
      src={src}
      alt="Preview"
      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
      onError={(e) => {
        console.error('Image preview error:', e);
      }}
    />
  </div>
);

const PDFPreview = ({ src }: { src: string }) => (
  <iframe
    src={src}
    className="w-full h-full flex-1 border-0 overflow-x-hidden"
    title="PDF Preview"
    onError={(e) => {
      console.error('PDF preview error:', e);
    }}
  />
);

const CSVPreview = ({ src, filename }: { src: string; filename: string }) => {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchCSV = async () => {
    try {
      setLoading(true);
      const response = await fetch(src);
      const text = await response.text();

      // Parse CSV
      const lines = text.split('\n').filter((line) => line.trim());
      const parsed = lines.map((line) => line.split(',').map((cell) => cell.trim().replace(/^"|"$/g, '')));

      setCsvData(parsed);
    } catch (err) {
      setError('Failed to load CSV file');
      console.error('CSV parse error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (src) {
      fetchCSV();
    }
  }, [src]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading CSV...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <Table className="min-w-full">
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              {csvData[0]?.map((header, index) => (
                <TableHead key={index} className="min-w-[120px] whitespace-nowrap">
                  {header || `Column ${index + 1}`}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {csvData.slice(1).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} className="min-w-[120px] whitespace-nowrap max-w-xs truncate">
                    <span title={cell}>{cell}</span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const MarkdownPreview = ({ src }: { src: string }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchMarkdown = async () => {
    try {
      setLoading(true);
      const response = await fetch(src);
      const text = await response.text();
      setContent(text);
    } catch (err) {
      setError('Failed to load Markdown file');
      console.error('Markdown fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (src) {
      fetchMarkdown();
    }
  }, [src]);

  return (
    <div className="w-full h-full flex flex-col">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Markdown...</p>
          </div>
        </div>
      ) : error ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap text-sm break-words">{content}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

const JSONPreview = ({ src, filename }: { src: string; filename: string }) => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [displayMode, setDisplayMode] = useState<'pretty' | 'raw'>('pretty');

  const fetchJSON = async () => {
    try {
      setLoading(true);
      const response = await fetch(src);
      const text = await response.text();

      // Parse JSON in chunks to avoid memory issues
      const parsed = JSON.parse(text);
      setJsonData(parsed);
    } catch (err) {
      setError('Failed to parse JSON file');
      console.error('JSON parse error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (src) {
      fetchJSON();
    }
  }, [src]);

  const isGeoJSON =
    filename.toLowerCase().includes('geojson') || (jsonData && (jsonData.type === 'FeatureCollection' || jsonData.type === 'Feature'));

  return (
    <div className="w-full h-full flex flex-col">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading JSON...</p>
          </div>
        </div>
      ) : error ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <Code className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
            <div className="flex items-center gap-2">
              {isGeoJSON && <MapPin className="w-4 h-4" />}
              <span className="text-sm font-medium">{isGeoJSON ? 'GeoJSON' : 'JSON'} Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setDisplayMode(displayMode === 'pretty' ? 'raw' : 'pretty')}>
                {displayMode === 'pretty' ? 'Raw' : 'Pretty'}
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <pre className="text-sm break-words">
              <code>{displayMode === 'pretty' ? JSON.stringify(jsonData, null, 2) : JSON.stringify(jsonData)}</code>
            </pre>
          </div>
        </>
      )}
    </div>
  );
};

// Get preview component based on file type
const getPreviewComponent = (file: FileRecord) => {
  const extension = file.filename.split('.').pop()?.toLowerCase();
  const contentType = file.file_type_code.toLowerCase();

  // Images
  if (contentType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension || '')) {
    return <ImagePreview src={file?.public_url || ''} />;
  }

  // PDF
  if (contentType.includes('pdf') || extension === 'pdf') {
    return <PDFPreview src={file?.public_url || ''} />;
  }

  // CSV
  if (extension === 'csv' || contentType.includes('csv')) {
    return <CSVPreview src={file?.public_url || ''} filename={file.filename} />;
  }

  // Markdown
  if (extension === 'md' || extension === 'markdown') {
    return <MarkdownPreview src={file?.public_url || ''} />;
  }

  // JSON and GeoJSON
  if (extension === 'json' || extension === 'geojson' || contentType.includes('json')) {
    return <JSONPreview src={file?.public_url || ''} filename={file.filename} />;
  }

  // Default: Not supported
  return null;
};

export default function FilePreviewDialog({ file }: FilePreviewDialogProps) {
  const [open, setOpen] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // If no file, don't render anything
  if (!file) return null;

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger>
        <Button variant="link" size="sm" className="hover:bg-white/20">
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 flex flex flex-col space-y-0 w-full min-w-full max-h-[100vh] max-w-7xl h-full p-0">
        <DialogHeader className="p-0 border-b px-4 h-[8vh] flex-wrap items-center overflow-hidden flex flex-row justify-between w-full">
          <DialogTitle className="truncate flex-1 max-w-[150x] trancate">{file.filename.replace(/[_-]/g, ' ')}</DialogTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex justify-center gap-2">
              <Button variant="secondary" onClick={() => window.open(file.public_url, '_blank')}>
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:block">Download</span>
              </Button>
              <Button variant="secondary" onClick={() => window.open(file.public_url, '_blank')}>
                <Eye className="w-4 h-4 mr-2" />
                <span className="hidden sm:block">View Original</span>
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)} title="Close">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="p-0 h-full max-h-[92vh] overflow-x-hidden">
          {getPreviewComponent(file) || (
            <div className="text-center p-8">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Preview Not Available</h3>
              <p className="text-muted-foreground mb-4">This file type cannot be previewed in the browser.</p>
              <Button asChild>
                <a href={file?.public_url} download>
                  <Download className="w-4 h-4 mr-2" />
                  Download File
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
