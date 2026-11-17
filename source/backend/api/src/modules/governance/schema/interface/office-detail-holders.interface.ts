import type { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { OfficeDetailHoldersNames } from "#/modules/governance/schema/interface/office-detail-holders-names.interface.ts";

/** Office Detail Holders */
export interface OfficeDetailHolders {
  appointment: IdentityCode;
  fromToPrecision: DatePrecision | null;
  fromYear: Year | null;
  individualId: Id;
  names: OfficeDetailHoldersNames[];
  toYear: Year | null;
}
