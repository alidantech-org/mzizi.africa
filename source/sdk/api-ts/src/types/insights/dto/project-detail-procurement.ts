import type { InsightsProjectDetailProcurementBids } from "#sdk/types/insights/dto/project-detail-procurement-bids.ts";
import type { InsightsProjectDetailProcurementContracts } from "#sdk/types/insights/dto/project-detail-procurement-contracts.ts";

/** Project Detail Procurement */
export interface InsightsProjectDetailProcurement {
  awardedOn?: string | null;
  bids: InsightsProjectDetailProcurementBids[];
  buyer: string;
  closesOn: string;
  code: string;
  contracts: InsightsProjectDetailProcurementContracts[];
  procedure: string;
  publishedOn: string;
  reference?: string | null;
  status: string;
  title?: string | null;
}
