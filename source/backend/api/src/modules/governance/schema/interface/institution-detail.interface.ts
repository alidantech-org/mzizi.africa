
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { InstitutionDetailMandates } from "#/modules/governance/schema/interface/institution-detail-mandates.interface.ts";
import type { InstitutionDetailNames } from "#/modules/governance/schema/interface/institution-detail-names.interface.ts";
import type { InstitutionDetailOffices } from "#/modules/governance/schema/interface/institution-detail-offices.interface.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Institution Detail */
export interface InstitutionDetail {
  code: IdentityCode;
  id: Id;
  kind: IdentityCode;
  mandates: InstitutionDetailMandates[];
  names: InstitutionDetailNames[];
  offices: InstitutionDetailOffices[];
  validFrom: CalendarDate | null;
  validUntil: CalendarDate | null;
}