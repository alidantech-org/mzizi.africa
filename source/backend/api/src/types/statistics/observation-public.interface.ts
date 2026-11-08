
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { ConfidenceLevel } from "#/types/statistics/confidence-level.enum.ts";
import type { EstimateKind } from "#/types/statistics/estimate-kind.enum.ts";
import type { MeasureType } from "#/types/statistics/measure-type.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { ObservationValue } from "#/types/statistics/observation-value.type.ts";
import type { ReleaseLabel } from "#/types/statistics/release-label.type.ts";
import type { StatisticsTable } from "#/types/statistics/statistics-table.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Observation Public */
export interface ObservationPublic {
  columnId?: Id | null;
  confidenceLevel: ConfidenceLevel;
  createdAt: DateTime;
  denominatorObservationId?: Id | null;
  denominatorValue?: ObservationValue | null;
  estimateKind?: EstimateKind | null;
  geoUnitId?: Id | null;
  id: Id;
  indicatorId: Id;
  isCurrent: Flag;
  marginOfError?: ObservationValue | null;
  measureType?: MeasureType | null;
  numericValue?: ObservationValue | null;
  periodId: Id;
  releaseLabel?: ReleaseLabel | null;
  standardError?: ObservationValue | null;
  tableId: Id;
  textValue?: Description | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
  vintageId?: Id | null;
}