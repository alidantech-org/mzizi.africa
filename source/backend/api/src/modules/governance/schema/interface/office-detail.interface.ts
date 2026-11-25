import type { Seat } from "#/modules/governance/schema/type/seat.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { OfficeDetailHolders } from "#/modules/governance/schema/interface/office-detail-holders.interface.ts";
import type { OfficeDetailNames } from "#/modules/governance/schema/interface/office-detail-names.interface.ts";

/** Office Detail */
export interface OfficeDetail {
  code: IdentityCode;
  featureId: Id | null;
  holders: OfficeDetailHolders[];
  institutionId: Id;
  names: OfficeDetailNames[];
  officeId: Id;
  positionId: Id;
  roleTerm: Id;
  seat: Seat | null;
  termLimit: PositiveInteger | null;
  termYears: PositiveInteger | null;
}
