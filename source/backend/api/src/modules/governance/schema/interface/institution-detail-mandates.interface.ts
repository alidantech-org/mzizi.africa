import type { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/** Institution Detail Mandates */
export interface InstitutionDetailMandates {
  description: Description;
  fromToPrecision: DatePrecision | null;
  fromYear: Year | null;
  kind: IdentityCode;
  toYear: Year | null;
}
