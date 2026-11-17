import type { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { InstitutionDetailMandates } from "#/modules/governance/schema/interface/institution-detail-mandates.interface.ts";
import type { InstitutionDetailNames } from "#/modules/governance/schema/interface/institution-detail-names.interface.ts";
import type { InstitutionDetailOffices } from "#/modules/governance/schema/interface/institution-detail-offices.interface.ts";

/** Institution Detail */
export interface InstitutionDetail {
  code: IdentityCode;
  fromToPrecision: DatePrecision | null;
  fromYear: Year | null;
  id: Id;
  kind: IdentityCode;
  mandates: InstitutionDetailMandates[];
  names: InstitutionDetailNames[];
  offices: InstitutionDetailOffices[];
  toYear: Year | null;
}
