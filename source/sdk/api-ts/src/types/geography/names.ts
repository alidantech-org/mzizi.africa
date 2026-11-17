/** A canonical, official, local, alternative, translated or historical name for a feature, with its language (`mul` or `und` when no single language applies), validity and provenance reference. */
export interface GeographyNames {
  createdAt: string;
  deletedAt?: string | null;
  featureId: string;
  id: string;
  isDefault: boolean;
  languageId: string;
  name: string;
  nameKindId: string;
  updatedAt: string;
  version: number;
}
