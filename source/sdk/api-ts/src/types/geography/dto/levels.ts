/** One level of a country's administrative or electoral ladder: its depth and the kind of place found there. The ladder is data, so no screen or read names levels. */
export interface GeographyLevels {
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  depth: number;
  featureKindId: string;
  hierarchyKindId: string;
  id: string;
  isRoutingHierarchy: boolean;
  rootFeatureId?: string | null;
  updatedAt: string;
  version: number;
}
