/** A stored GIS file used for a feature or for one of its geometries. One file can serve many features and a feature can have many files. Photographs and video are filesystem media; acquisition and provenance belong to Source. */
export interface GeographyAssets {
  band?: number | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  description?: string | null;
  featureId: string;
  fileVersionId: string;
  geometryId?: string | null;
  id: string;
  kindId: string;
  layer?: string | null;
  member?: string | null;
  purposeId: string;
  updatedAt: string;
  version: number;
}
