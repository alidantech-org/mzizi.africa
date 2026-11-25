import type { FigureBasis } from "#/modules/shared/schema/enum/figure-basis.enum.ts";
import type { FigureStatus } from "#/modules/shared/schema/enum/figure-status.enum.ts";
import type { Cell } from "#/modules/shared/schema/type/cell.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { ObservationEntryBreakdowns } from "#/modules/statistics/schema/interface/observation-entry-breakdowns.interface.ts";

/** Observation Entry */
export interface ObservationEntry {
  basis: FigureBasis;
  breakdowns: ObservationEntryBreakdowns[];
  cell: Cell;
  collectionId: Id | null;
  fromYear: Year | null;
  lower: Number | null;
  observationId: Id;
  revision: PositiveInteger;
  status: FigureStatus;
  supersedesId: Id | null;
  toYear: Year | null;
  upper: Number | null;
  value: Number | null;
}
