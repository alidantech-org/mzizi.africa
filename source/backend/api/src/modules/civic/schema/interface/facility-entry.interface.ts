import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { FacilityEntryNames } from "#/modules/civic/schema/interface/facility-entry-names.interface.ts";

/** Facility Entry */
export interface FacilityEntry {
  classTerm: Id;
  code: IdentityCode;
  facilityId: Id;
  names: FacilityEntryNames[];
  ownershipTerm: Id | null;
  statusTerm: Id | null;
}
