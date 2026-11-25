import { SharedFigureBasis } from "#sdk/types/shared/enums/figure-basis.ts";
import { SharedFigureStatus } from "#sdk/types/shared/enums/figure-status.ts";
import type { StatisticsObservationEntryBreakdowns } from "#sdk/types/statistics/dto/observation-entry-breakdowns.ts";

/** Observation Entry */
export interface StatisticsObservationEntry {
  basis: SharedFigureBasis;
  breakdowns: StatisticsObservationEntryBreakdowns[];
  cell: string;
  collectionId: string | null;
  fromYear: number | null;
  lower: number | null;
  observationId: string;
  revision: number;
  status: SharedFigureStatus;
  supersedesId: string | null;
  toYear: number | null;
  upper: number | null;
  value: number | null;
}
