/** Stable API, website or extraction configuration identity; contents remain versioned artifacts. */
export interface SourceManifests {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  description?: string | null;
  id: string;
  kindId: string;
  title: string;
  updatedAt: string;
  version: number;
}
