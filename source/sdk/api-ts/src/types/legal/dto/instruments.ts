/** Stable instrument identity, independent of its names, editions, downloads and languages. */
export interface LegalInstruments {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  enactedOn?: string | null;
  id: string;
  issuingEntityId?: string | null;
  issuingUnitId?: string | null;
  kindId: string;
  publishedOn?: string | null;
  statusId?: string | null;
  updatedAt: string;
  version: number;
}
