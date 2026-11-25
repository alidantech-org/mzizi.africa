import type { FigureBasis } from "#/modules/shared/schema/enum/figure-basis.enum.ts";
import type { FigureStatus } from "#/modules/shared/schema/enum/figure-status.enum.ts";
import type { Cell } from "#/modules/shared/schema/type/cell.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Figure Entry */
export interface FigureEntry {
  basis: FigureBasis;
  cell: Cell;
  endsOn: CalendarDate | null;
  featureId: Id;
  figureId: Id;
  fromYear: Year | null;
  indicatorCode: IdentityCode | null;
  indicatorId: Id | null;
  lower: Number | null;
  metricId: Id | null;
  observationId: Id | null;
  refreshedAt: Instant;
  startsOn: CalendarDate | null;
  status: FigureStatus;
  subjectId: Id | null;
  toYear: Year | null;
  upper: Number | null;
  value: Number | null;
}
