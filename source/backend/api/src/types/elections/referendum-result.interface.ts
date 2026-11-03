
import type { ResultStatus } from "#/types/elections/result-status.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { EvidenceForm } from "#/types/elections/evidence-form.type.ts";
import type { Votes } from "#/types/elections/votes.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { ReferendumOption } from "#/types/elections/referendum-option.interface.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Referendum Result */
export interface ReferendumResult {
  createdAt: DateTime;
  declaredAt?: DateTime | null;
  declaringInstitutionId?: Id | null;
  evidenceForm?: EvidenceForm | null;
  geoUnitId?: Id | null;
  id: Id;
  isCurrent: Flag;
  optionId: Id;
  resultLevelId: Id;
  resultStatus?: ResultStatus | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
  votes: Votes;
}