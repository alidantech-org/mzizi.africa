/** An official, local, alternative, translated or historical name for a feature, with optional language, validity and provenance reference. */
export interface GeographyNames {
  createdAt: string;
  deletedAt?: string | null;
  featureId: string;
  id: string;
  languageTag?: string | null;
  name: string;
  nameKindId: string;
  updatedAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  version: number;
}
