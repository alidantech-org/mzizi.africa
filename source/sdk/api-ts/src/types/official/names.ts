/** One attested name form for exactly one entity or individual, with its language (`mul` or `und` when none applies) and validity. */
export interface OfficialNames {
  createdAt: string;
  deletedAt?: string | null;
  entityId?: string | null;
  id: string;
  individualId?: string | null;
  isPreferred: boolean;
  languageId: string;
  name: string;
  nameKindId: string;
  sourceCitationId?: string | null;
  updatedAt: string;
  version: number;
}
