import type { CivicTenderEntryNames } from "#sdk/types/civic/dto/tender-entry-names.ts";

/** Tender Entry */
export interface CivicTenderEntry {
  amount: number | null;
  buyerId: string;
  categoryTerm: string;
  closesOn: string | null;
  code: string;
  currencyCode: string | null;
  names: CivicTenderEntryNames[];
  procedureTerm: string;
  procurementId: string;
  publishedOn: string | null;
  statusTerm: string;
}
