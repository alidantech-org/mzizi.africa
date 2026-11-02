import {
  FileText,
  Image,
  Video,
  Music,
  Archive,
  FileJson,
  FileSpreadsheet,
  FileType2,
  Map,
  File,
  FileCode,
  FileArchive,
  Presentation,
  FileImage,
  Database,
} from 'lucide-react';

// Get file icon based on type using theme colors
export const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'image':
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'bmp':
    case 'webp':
    case 'tiff':
    case 'tif':
    case 'ico':
    case 'heic':
    case 'heif':
    case 'raw':
    case 'cr2':
    case 'nef':
    case 'arw':
      return <Image className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    case 'video':
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'flv':
    case 'mkv':
    case 'webm':
      return <Video className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    case 'audio':
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
    case 'ogg':
    case 'wma':
    case 'm4a':
      return <Music className="w-4 h-4 text-pink-600 dark:text-pink-400" />;
    case 'archive':
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
    case 'bz2':
      return <FileArchive className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    case 'json':
      return <FileJson className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
    case 'geojson':
      return <Map className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
    case 'csv':
    case 'xlsx':
    case 'xls':
    case 'spreadsheet':
    case 'ods':
      return <FileSpreadsheet className="w-4 h-4 text-green-600 dark:text-green-400" />;
    case 'pdf':
      return <FileType2 className="w-4 h-4 text-red-600 dark:text-red-400" />;
    case 'doc':
    case 'docx':
    case 'document':
    case 'odt':
    case 'rtf':
    case 'txt':
      return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case 'ppt':
    case 'pptx':
    case 'presentation':
    case 'odp':
      return <Presentation className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
    case 'svg':
    case 'vector':
    case 'eps':
    case 'ai':
      return <FileImage className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
    case 'dbf':
    case 'sql':
    case 'db':
    case 'sqlite':
    case 'mdb':
    case 'accdb':
    case 'database':
      return <Database className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
    case 'html':
    case 'css':
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
    case 'code':
    case 'py':
    case 'python':
    case 'java':
    case 'c':
    case 'cpp':
    case 'cs':
    case 'go':
    case 'rust':
    case 'rs':
    case 'php':
    case 'rb':
    case 'ruby':
    case 'swift':
    case 'kt':
    case 'kotlin':
    case 'scala':
    case 'sh':
    case 'bash':
    case 'ps1':
    case 'powershell':
    case 'yaml':
    case 'yml':
    case 'xml':
    case 'toml':
    case 'ini':
    case 'cfg':
    case 'conf':
    case 'md':
    case 'markdown':
      return <FileCode className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
    default:
      return <File className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
  }
};

// Get description for file type
export const getFileTypeDescription = (fileType: string): string => {
  switch (fileType.toLowerCase()) {
    case 'image':
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'bmp':
    case 'webp':
    case 'tiff':
    case 'tif':
    case 'ico':
    case 'heic':
    case 'heif':
    case 'raw':
    case 'cr2':
    case 'nef':
    case 'arw':
      return 'Images & Photos';
    case 'video':
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'flv':
    case 'mkv':
    case 'webm':
      return 'Video Files';
    case 'audio':
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
    case 'ogg':
    case 'wma':
    case 'm4a':
      return 'Audio & Music';
    case 'archive':
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
    case 'bz2':
      return 'Compressed Archives';
    case 'json':
      return 'JSON Data Files';
    case 'geojson':
      return 'Geographic Data';
    case 'csv':
      return 'CSV Spreadsheets';
    case 'xlsx':
    case 'xls':
    case 'spreadsheet':
    case 'ods':
      return 'Excel Spreadsheets';
    case 'pdf':
      return 'PDF Documents';
    case 'doc':
    case 'docx':
    case 'document':
    case 'odt':
    case 'rtf':
    case 'txt':
      return 'Word Documents';
    case 'ppt':
    case 'pptx':
    case 'presentation':
    case 'odp':
      return 'Presentations';
    case 'svg':
    case 'vector':
    case 'eps':
    case 'ai':
      return 'Vector Graphics';
    case 'dbf':
    case 'sql':
    case 'db':
    case 'sqlite':
    case 'mdb':
    case 'accdb':
    case 'database':
      return 'Database Files';
    case 'html':
    case 'css':
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
    case 'code':
    case 'py':
    case 'python':
    case 'java':
    case 'c':
    case 'cpp':
    case 'cs':
    case 'go':
    case 'rust':
    case 'rs':
    case 'php':
    case 'rb':
    case 'ruby':
    case 'swift':
    case 'kt':
    case 'kotlin':
    case 'scala':
    case 'sh':
    case 'bash':
    case 'ps1':
    case 'powershell':
    case 'yaml':
    case 'yml':
    case 'xml':
    case 'toml':
    case 'ini':
    case 'cfg':
    case 'conf':
    case 'md':
    case 'markdown':
      return 'Code Files';
    default:
      return 'Other Files';
  }
};
