/** A preserved identifier assigned to a feature by an external geographic registry or source system. */
export interface GeographyIdentifiers {
  createdAt: string;
  deletedAt?: string | null;
  externalId: string;
  featureId: string;
  id: string;
  identifierSchemeId: string;
  namespace?: string | null;
  updatedAt: string;
  version: number;
}
