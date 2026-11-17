/** One dated classification of a feature by a scheme value, so a feature can answer several classification questions and change over time. */
export interface GeographyClassifications {
  createdAt: string;
  deletedAt?: string | null;
  featureId: string;
  id: string;
  updatedAt: string;
  validFrom?: string | null;
  validFromEarliest?: string | null;
  validFromLatest?: string | null;
  validUntil?: string | null;
  validUntilEarliest?: string | null;
  validUntilLatest?: string | null;
  valueId: string;
  version: number;
}
