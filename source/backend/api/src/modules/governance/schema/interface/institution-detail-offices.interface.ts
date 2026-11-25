import type { Seat } from "#/modules/governance/schema/type/seat.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { InstitutionDetailOfficesHolders } from "#/modules/governance/schema/interface/institution-detail-offices-holders.interface.ts";
import type { InstitutionDetailOfficesNames } from "#/modules/governance/schema/interface/institution-detail-offices-names.interface.ts";

/** Institution Detail Offices */
export interface InstitutionDetailOffices {
  code: IdentityCode;
  featureId: Id | null;
  holders: InstitutionDetailOfficesHolders[];
  names: InstitutionDetailOfficesNames[];
  officeId: Id;
  order: NonNegativeInteger | null;
  roleTerm: Id;
  seat: Seat | null;
}
