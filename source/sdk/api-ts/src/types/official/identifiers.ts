/** One exact external identifier assigned to an entity or individual under a Reference scheme and optional issuer. */
export interface OfficialIdentifiers {
  createdAt: string;
  deletedAt?: string | null;
  entityId?: string | null;
  id: string;
  individualId?: string | null;
  issuerEntityId?: string | null;
  namespace?: string | null;
  schemeId: string;
  sourceCitationId?: string | null;
  updatedAt: string;
  value: string;
  version: number;
}
