/**
 * This file contains the types that are used to deserialize the response
 * bodies from the server API endpoints related to files, file types, folders,
 * and file uploads/deletes.
 */

import { FileRecord } from './file';
import { FileType } from './file-type';
import { Folder } from './folder';
import { Pagination } from './pagination';

/**
 * Represents the response body for the files search endpoint.
 */
export interface FilesSearchResponse {
  files: FileRecord[];
  pagination: Pagination;
  search_time_ms?: number;
  filter_summary?: string;
  file_type_counts?: Record<string, number>;
  size_stats?: {
    min: number;
    max: number;
    avg: number;
    total: number;
  };
  applied_filters?: Record<string, any>;
}

/**
 * Represents the response body for the file types list endpoint.
 */
export interface GetFileTypesResponse {
  file_types: FileType[];
  pagination: Pagination;
}

/**
 * Represents the response body for the folders list endpoint.
 */
export interface GetFoldersResponse {
  folders: Folder[];
  pagination: Pagination;
}

/**
 * Represents the response body for the file type categories endpoint.
 */
export interface GetFileCategoriesResponse {
  file_type_categories: string[];
}

/**
 * Represents the response body for the files upload endpoint.
 */
export interface UploadFileResponse {
  file: FileRecord;
}

/**
 * Represents the response body for the files delete endpoint.
 */
export interface DeleteFileResponse {
  success: boolean;
  message: string;
  deleted_file?: FileRecord;
}

/**
 * Represents the response body for file details endpoint.
 */
export interface GetFileResponse {
  file: FileRecord;
}

/**
 * Represents the response body for file statistics.
 */
export interface FileStatsResponse {
  total_files: number;
  files_by_type: Array<{
    type: string;
    count: number;
    total_size_mb: number;
  }>;
  files_by_folder: Array<{
    path: string;
    count: number;
    total_size_mb: number;
  }>;
}

/**
 * Represents the response body for analytics endpoint.
 */
export interface GetAnalyticsResponse {
  summary: {
    total_files: number;
    total_size: number;
    total_size_mb: number;
    total_size_gb: number;
    avg_file_size: number;
    avg_file_size_mb: number;
    total_folders: number;
  };
  file_type_distribution: Array<{
    type: string;
    count: number;
    size_mb: number;
  }>;
  folder_distribution: Array<{
    folder: string;
    folder_path: string;
    files: number;
    size_mb: number;
  }>;
  size_distribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  growth_metrics: {
    monthly: GrowthMetric[];
    weekly: GrowthMetric[];
    daily: GrowthMetric[];
    yearly: GrowthMetric[];
  };
  growth_type: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export type GrowthMetric = {
  period: string;
  upload_count: number;
  total_size: number;
  file_count: number;
};
