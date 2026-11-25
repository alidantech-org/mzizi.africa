import type { CivicTenderDetailBids } from "#sdk/types/civic/dto/tender-detail-bids.ts";
import type { CivicTenderDetailNames } from "#sdk/types/civic/dto/tender-detail-names.ts";

/** Tender Detail */
export interface CivicTenderDetail {
  amount: number | null;
  bidderCount: number | null;
  bids: CivicTenderDetailBids[];
  buyerId: string;
  categoryTerm: string;
  code: string;
  currencyCode: string | null;
  names: CivicTenderDetailNames[];
  procedureTerm: string;
  procurementId: string;
  projectId: string | null;
  statusTerm: string;
}
