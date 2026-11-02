
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { ColumnDataType } from "#/types/statistics/column-data-type.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { Indicator } from "#/types/statistics/indicator.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Indicator Column */
export interface IndicatorColumn {
  code: BusinessCode;
  createdAt: DateTime;
  dataType: ColumnDataType;
  id: Id;
  indicatorId: Id;
  isCurrent: Flag;
  label: Label;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}