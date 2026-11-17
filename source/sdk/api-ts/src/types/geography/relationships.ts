/** A typed, dated directed relationship between features; separate rows allow overlapping administrative, electoral, statistical and other systems. */
export interface GeographyRelationships {
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  objectFeatureId: string;
  relationshipKindId: string;
  subjectFeatureId: string;
  systemId: string;
  updatedAt: string;
  validFrom?: string | null;
  validFromEarliest?: string | null;
  validFromLatest?: string | null;
  validUntil?: string | null;
  validUntilEarliest?: string | null;
  validUntilLatest?: string | null;
  version: number;
}
