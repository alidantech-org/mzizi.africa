
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { ConfidenceLevel } from "#/types/statistics/confidence-level.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { ObservationValue } from "#/types/statistics/observation-value.type.ts";
import type { StatisticsTable } from "#/types/statistics/statistics-table.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Observation Public */
export interface ObservationPublic {
  columnId?: Id | null;
  confidenceLevel: ConfidenceLevel;
  createdAt: DateTime;
  geoUnitId?: Id | null;
  id: Id;
  indicatorId: Id;
  isCurrent: Flag;
  numericValue?: ObservationValue | null;
  periodId: Id;
  tableId: Id;
  textValue?: Description | null;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}