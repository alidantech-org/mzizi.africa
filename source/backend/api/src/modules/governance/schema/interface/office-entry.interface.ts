import type { Seat } from "#/modules/governance/schema/type/seat.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { OfficeEntryHolders } from "#/modules/governance/schema/interface/office-entry-holders.interface.ts";
import type { OfficeEntryNames } from "#/modules/governance/schema/interface/office-entry-names.interface.ts";

/** Office Entry */
export interface OfficeEntry {
  code: IdentityCode;
  holders: OfficeEntryHolders[];
  institutionCode: IdentityCode;
  institutionId: Id;
  methodTerm: Id | null;
  names: OfficeEntryNames[];
  officeId: Id;
  order: NonNegativeInteger | null;
  roleTerm: Id;
  seat: Seat | null;
}
