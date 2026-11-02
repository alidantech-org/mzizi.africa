/**
 * File interface matching the database model
 */

export interface FileRecord {
  id: string; // UUID
  filename: string;
  s3_key: string;
  s3_bucket: string;
  directory_id: string; // UUID
  file_type_code: string;
  size_bytes: number;
  checksum: string;
  status: string; // uploaded, processing, failed, completed
  file_metadata?: Record<string, any>;
  public_url?: string;
  created_at: string; // ISO datetime
  updated_at?: string; // ISO datetime

  // Computed properties from relationships
  directory_path?: string;
  mime_type?: string;
}

// Utility functions
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString();
}
