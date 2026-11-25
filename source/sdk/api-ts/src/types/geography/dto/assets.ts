/** A stored GIS file or prepared map output (tile set, TopoJSON) for a feature, through filesystem versions. */
export interface GeographyAssets {
  band?: number | null;
  builtAt?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  featureId: string;
  geometryId?: string | null;
  hierarchyId?: string | null;
  id: string;
  kindTerm: string;
  layer?: string | null;
  levelId?: string | null;
  member?: string | null;
  purposeTerm: string;
  staleAt?: string | null;
  updatedAt: string;
  version: number;
  versionId: string;
}
