import type { CivicFacilityEntryNames } from "#sdk/types/civic/dto/facility-entry-names.ts";

/** Facility Entry */
export interface CivicFacilityEntry {
  classTerm: string;
  code: string;
  facilityId: string;
  names: CivicFacilityEntryNames[];
  ownershipTerm: string | null;
  statusTerm: string | null;
}
