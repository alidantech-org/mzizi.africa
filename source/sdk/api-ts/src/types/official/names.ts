/** One attested name form for exactly one entity or individual, with optional language and validity. */
export interface OfficialNames {
  createdAt: string;
  deletedAt?: string | null;
  entityId?: string | null;
  id: string;
  individualId?: string | null;
  isPreferred: boolean;
  languageTag?: string | null;
  name: string;
  nameKindId: string;
  sourceCitationId?: string | null;
  updatedAt: string;
  validFrom?: string | null;
  validUntil?: string | null;
  version: number;
}
