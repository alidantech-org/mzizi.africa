/** A dated link between places; a parent link in a hierarchy also records the inner place's level. */
export interface GeographyRelationships {
  createdAt: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  fromYear?: number | null;
  hierarchyId?: string | null;
  id: string;
  kindTerm: string;
  levelId?: string | null;
  objectFeatureId: string;
  startsOn?: string | null;
  subjectFeatureId: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
