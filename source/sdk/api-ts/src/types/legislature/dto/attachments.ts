/** Media on proceedings that are not identities (the parliamentary video of a speech). */
export interface LegislatureAttachments {
  articleId?: string | null;
  assetId?: string | null;
  billId?: string | null;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  endSecond?: number | null;
  id: string;
  position?: number | null;
  purposeTerm: string;
  sittingId?: string | null;
  speechId?: string | null;
  startSecond?: number | null;
  updatedAt: string;
  version: number;
}
