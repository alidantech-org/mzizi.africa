
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { InstitutionDetailMandates } from "#/modules/governance/interface/institution-detail-mandates.interface.ts";
import type { InstitutionDetailNames } from "#/modules/governance/interface/institution-detail-names.interface.ts";
import type { InstitutionDetailOffices } from "#/modules/governance/interface/institution-detail-offices.interface.ts";
import type { CalendarDate } from "#/modules/shared/type/calendar-date.type.ts";

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