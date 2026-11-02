'use server';
import { ENDPOINTS } from '@/lib/endpoints';
import AppServer from '@/server';
import { revalidatePath } from 'next/cache';
import { GetFilesQuery, GetFileTypesQuery, GetFoldersQuery, GetAnalyticsQuery } from './types/request';
import {
  FilesSearchResponse,
  GetFileTypesResponse,
  GetFoldersResponse,
  GetFileCategoriesResponse,
  GetAnalyticsResponse,
} from './types/response';

/**
 * @description Comprehensive file search with all filtering capabilities
 * @param query - Search filters and options
 * @returns Files search response with comprehensive data
 */
export async function getAndsearchFiles(query: GetFilesQuery) {
  return await AppServer.get<FilesSearchResponse>(ENDPOINTS.FILES.GET.files, {
    query: { ...query, include_urls: true } as unknown as Record<string, string>,
  });
}

/**
 * @description Fetch file types statistics
 * @returns File types with counts and statistics
 */
export async function getFileTypes(query: GetFileTypesQuery) {
  return await AppServer.get<GetFileTypesResponse>(ENDPOINTS.FILES.GET.fileTypes, { query: query as Record<string, string> });
}

/**
 * @description Fetch folder structure
 * @returns Folders with file counts and metadata
 */
export async function getFolders(query: GetFoldersQuery) {
  return await AppServer.get<GetFoldersResponse>(ENDPOINTS.FILES.GET.folders, { query: query as Record<string, string> });
}

/**
 * @description Fetch file type categories
 * @returns File type categories list
 */
export async function getFileCategories() {
  return await AppServer.get<GetFileCategoriesResponse>(ENDPOINTS.FILES.GET.categories);
}

/**
 * @description Delete a file by S3 key
 * @param s3Key - S3 key of the file to delete
 * @returns Success status
 */
export async function deleteFile(s3Key: string) {
  const response = await AppServer.get(ENDPOINTS.FILES.DELETE.byS3Key(s3Key));
  if (response.success) revalidatePath('/storage/explore');
  return response;
}

/**
 * @description Upload a file
 * @param file - File to upload
 * @returns File record with metadata
 */
export async function postFile(prev: FormData, formData: FormData) {
  return await AppServer.post(ENDPOINTS.FILES.POST.upload.single, formData, { isMultipart: true });
}

/**
 * @description Fetch file by ID
 * @param id - File ID
 * @returns File record with metadata
 */
export async function getFile(id: string) {
  return await AppServer.get(ENDPOINTS.FILES.GET.byId(id));
}

/**
 * @description Get comprehensive file analytics with filtering and time-based grouping
 * @param query - Analytics filters and options
 * @returns Comprehensive analytics data with charts-ready formats
 */
export async function getAnalytics(query: GetAnalyticsQuery) {
  return await AppServer.get<GetAnalyticsResponse>(ENDPOINTS.FILES.GET.analytics, { query: query as Record<string, string> });
}
