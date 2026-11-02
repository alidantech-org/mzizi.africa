export interface GetFilesQuery {
  search?: string;
  search_mode?: 'contains' | 'exact' | 'starts_with' | 'ends_with';
  case_sensitive?: boolean;
  file_type_codes?: string[];
  directory_ids?: string[];
  content_types?: string[];
  folder?: string; // S3 key pattern
  category?: string; // File type category
  size_min?: number;
  size_max?: number;
  date_from?: string; // ISO datetime
  date_to?: string; // ISO datetime
  sort_field?: 'filename' | 'createdAt' | 'updatedAt' | 'size_bytes' | 'file_type_code' | 'directory_id';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  include_metadata?: boolean;
  include_urls?: boolean;
  include_stats?: boolean;
}

export interface GetFileTypesQuery {
  search?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface GetFoldersQuery {
  search?: string;
  max_depth?: number;
  min_depth?: number;
  limit?: number;
  offset?: number;
}

export interface UploadFileRequest {
  description?: string;
  metadata?: Record<string, any>;
}

export interface DeleteFileRequest {
  s3Key: string;
}

export interface GetFileRequest {
  id: string;
}

export interface GetAnalyticsQuery {
  file_type?: string; // File type category (document, image, video, audio, archive, data)
  folder?: string; // Folder path (e.g., input/uploads)
  size_range?: string; // Size range (0-1MB, 1-10MB, 10-50MB, 50-100MB, 100MB+)
  date_from?: string; // ISO datetime
  date_to?: string; // ISO datetime
}
