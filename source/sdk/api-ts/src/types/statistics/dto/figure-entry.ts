import { SharedFigureBasis } from "#sdk/types/shared/enums/figure-basis.ts";
import { SharedFigureStatus } from "#sdk/types/shared/enums/figure-status.ts";

/** Figure Entry */
export interface StatisticsFigureEntry {
  basis: SharedFigureBasis;
  cell: string;
  endsOn: string | null;
  featureId: string;
  figureId: string;
  fromYear: number | null;
  indicatorCode: string | null;
  indicatorId: string | null;
  lower: number | null;
  metricId: string | null;
  observationId: string | null;
  refreshedAt: string;
  startsOn: string | null;
  status: SharedFigureStatus;
  subjectId: string | null;
  toYear: number | null;
  upper: number | null;
  value: number | null;
}
