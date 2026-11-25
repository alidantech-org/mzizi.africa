import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { InstitutionDetailNames } from "#/modules/governance/schema/interface/institution-detail-names.interface.ts";
import type { InstitutionDetailOffices } from "#/modules/governance/schema/interface/institution-detail-offices.interface.ts";

/** Institution Detail */
export interface InstitutionDetail {
  armTerm: Id | null;
  basisTerm: Id | null;
  classTerm: Id | null;
  code: IdentityCode;
  countryId: Id;
  fromYear: Year | null;
  institutionId: Id;
  kindTerm: Id;
  names: InstitutionDetailNames[];
  offices: InstitutionDetailOffices[];
  toYear: Year | null;
}
