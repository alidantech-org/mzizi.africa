/**
 * Folder interface matching the database model
 */

export interface Folder {
  id: string; // UUID
  name: string;
  path: string;
  parent_id?: string; // UUID
  depth: number;
  description?: string;
  file_count: number;
  total_size_bytes: number;
  last_file_at?: string; // ISO datetime
  created_at: string; // ISO datetime
  updated_at?: string; // ISO datetime
  is_active: boolean;
}
