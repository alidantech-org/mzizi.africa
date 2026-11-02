
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Rank } from "#/types/elections/rank.type.ts";
import type { Votes } from "#/types/elections/votes.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Candidate } from "#/types/elections/candidate.interface.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Election Result */
export interface ElectionResult {
  candidateId: Id;
  createdAt: DateTime;
  declaredAt?: DateTime | null;
  declaringInstitutionId?: Id | null;
  geoUnitId?: Id | null;
  id: Id;
  isCurrent: Flag;
  isWinner: Flag;
  rank?: Rank | null;
  resultLevelId: Id;
  seatId: Id;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
  votes: Votes;
}