
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Granularity } from "#/types/statistics/granularity.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { HistoricalEntity } from "#/types/shared/historical-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Period */
export interface Period {
  code: BusinessCode;
  createdAt: DateTime;
  endsOn: Date;
  granularity: Granularity;
  id: Id;
  isCurrent: Flag;
  startsOn: Date;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}