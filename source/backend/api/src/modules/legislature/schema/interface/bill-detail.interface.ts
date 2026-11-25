import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { BillDetailNames } from "#/modules/legislature/schema/interface/bill-detail-names.interface.ts";
import type { BillDetailStages } from "#/modules/legislature/schema/interface/bill-detail-stages.interface.ts";

/** Bill Detail */
export interface BillDetail {
  billId: Id;
  code: IdentityCode;
  institutionId: Id;
  instrumentId: Id | null;
  kindTerm: Id;
  names: BillDetailNames[];
  sponsorId: Id | null;
  stages: BillDetailStages[];
  statusTerm: Id;
}
