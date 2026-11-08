
import type { NominationStatus } from "#/types/elections/nomination-status.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Seat } from "#/types/elections/seat.interface.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Candidate */
export interface Candidate {
  createdAt: DateTime;
  id: Id;
  isCurrent: Flag;
  isIndependent: Flag;
  nominationStatus: NominationStatus;
  partyId?: Id | null;
  personId: Id;
  seatId: Id;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}