
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";
import type { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { ConfidenceLevel } from "#/types/statistics/confidence-level.enum.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { ObservationValue } from "#/types/statistics/observation-value.type.ts";
import type { StatisticsTable } from "#/types/statistics/statistics-table.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Observation Public */
export interface ObservationPublic {
  artifactChecksum?: Checksum | null;
  artifactId?: Id | null;
  columnId?: Id | null;
  confidence?: Confidence | null;
  confidenceLevel: ConfidenceLevel;
  createdAt: DateTime;
  geoUnitId?: Id | null;
  id: Id;
  indicatorId: Id;
  isCurrent: Flag;
  licence?: Name | null;
  method: ProvenanceMethod;
  numericValue?: ObservationValue | null;
  periodId: Id;
  retrievedAt?: DateTime | null;
  sourceName: Name;
  sourceReference?: Description | null;
  sourceUrl?: Url | null;
  tableId: Id;
  textValue?: Description | null;
  toolOrModel?: Name | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  verificationState: VerificationState;
  version: Version;
}