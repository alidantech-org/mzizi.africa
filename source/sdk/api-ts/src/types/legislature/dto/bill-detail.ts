import type { LegislatureBillDetailNames } from "#sdk/types/legislature/dto/bill-detail-names.ts";
import type { LegislatureBillDetailStages } from "#sdk/types/legislature/dto/bill-detail-stages.ts";

/** Bill Detail */
export interface LegislatureBillDetail {
  billId: string;
  code: string;
  institutionId: string;
  instrumentId: string | null;
  kindTerm: string;
  names: LegislatureBillDetailNames[];
  sponsorId: string | null;
  stages: LegislatureBillDetailStages[];
  statusTerm: string;
}
