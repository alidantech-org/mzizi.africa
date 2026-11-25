import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { BillEntryNames } from "#/modules/legislature/schema/interface/bill-entry-names.interface.ts";

/** Bill Entry */
export interface BillEntry {
  billId: Id;
  code: IdentityCode;
  instrumentId: Id | null;
  kindTerm: Id;
  names: BillEntryNames[];
  statusTerm: Id;
  termId: Id | null;
}
