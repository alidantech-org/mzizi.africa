import type { String } from "#/modules/shared/schema/type/string.type.ts";
import type { ProjectDetailProcurementBids } from "#/modules/insights/schema/interface/project-detail-procurement-bids.interface.ts";
import type { ProjectDetailProcurementContracts } from "#/modules/insights/schema/interface/project-detail-procurement-contracts.interface.ts";

/** Project Detail Procurement */
export interface ProjectDetailProcurement {
  awardedOn?: String | null;
  bids: ProjectDetailProcurementBids[];
  buyer: String;
  closesOn: String;
  code: String;
  contracts: ProjectDetailProcurementContracts[];
  procedure: String;
  publishedOn: String;
  reference?: String | null;
  status: String;
  title?: String | null;
}
