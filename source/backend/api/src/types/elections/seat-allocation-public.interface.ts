
import type { AllocationKind } from "#/types/elections/allocation-kind.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Election } from "#/types/elections/election.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Seat Allocation Public */
export interface SeatAllocationPublic {
  allocatedOn?: Date | null;
  createdAt: DateTime;
  declaringInstitutionId?: Id | null;
  electionId: Id;
  geoUnitId?: Id | null;
  id: Id;
  isCurrent: Flag;
  kind: AllocationKind;
  listPosition?: Count | null;
  partyId: Id;
  personId?: Id | null;
  seatId?: Id | null;
  seatsEntitled?: Count | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}