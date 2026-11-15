
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { InstitutionDetailMandates } from "#/modules/governance/institution-detail-mandates.interface.ts";
import type { InstitutionDetailNames } from "#/modules/governance/institution-detail-names.interface.ts";
import type { InstitutionDetailOffices } from "#/modules/governance/institution-detail-offices.interface.ts";
import type { CalendarDate } from "#/modules/shared/calendar-date.type.ts";

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