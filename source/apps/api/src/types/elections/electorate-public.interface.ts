
import type { ResultStatus } from "#/types/elections/result-status.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { EvidenceForm } from "#/types/elections/evidence-form.type.ts";
import type { RegisterVersion } from "#/types/elections/register-version.type.ts";
import type { Votes } from "#/types/elections/votes.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Election } from "#/types/elections/election.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Electorate Public */
export interface ElectoratePublic {
  createdAt: DateTime;
  declaredAt?: DateTime | null;
  declaringInstitutionId?: Id | null;
  electionId: Id;
  evidenceForm?: EvidenceForm | null;
  geoUnitId?: Id | null;
  id: Id;
  isCurrent: Flag;
  registerVersion?: RegisterVersion | null;
  registeredVoters?: Votes | null;
  rejectedVotes?: Votes | null;
  resultLevelId: Id;
  resultStatus?: ResultStatus | null;
  seatId?: Id | null;
  spoiltVotes?: Votes | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  validVotes?: Votes | null;
  version: Version;
  votesCast?: Votes | null;
}