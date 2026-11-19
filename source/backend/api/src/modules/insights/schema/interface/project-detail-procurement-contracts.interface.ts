import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Project Detail Procurement Contracts */
export interface ProjectDetailProcurementContracts {
  amount: Number;
  contractor: String;
  signedOn: String;
  status: String;
}
