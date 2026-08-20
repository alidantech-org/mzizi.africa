/**
 * File type interface matching the database model
 */

export interface FileType {
  id: string; // UUID
  name: string;
  code: string;
  mime_type: string;
  extension: string;
  description?: string;
  category?: string;
  is_previewable: boolean;
  max_size_mb?: number;
  allowed_extensions?: string;
  processing_strategy?: string;
  created_at: string; // ISO datetime
  updated_at?: string; // ISO datetime
  is_active: boolean;
}