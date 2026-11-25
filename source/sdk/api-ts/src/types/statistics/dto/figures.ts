import { SharedFigureBasis } from "#sdk/types/shared/enums/figure-basis.ts";
import { SharedFigureStatus } from "#sdk/types/shared/enums/figure-status.ts";

/** Prepared: the one value to show per indicator or metric, place, subject, period and cell; refreshed after every load. */
export interface StatisticsFigures {
  basis: SharedFigureBasis;
  cell: string;
  countryId: string;
  createdAt: string;
  endsOn?: string | null;
  featureId: string;
  fromYear?: number | null;
  id: string;
  indicatorId?: string | null;
  lower?: number | null;
  metricId?: string | null;
  observationId?: string | null;
  refreshedAt: string;
  startsOn?: string | null;
  status: SharedFigureStatus;
  subjectId?: string | null;
  toYear?: number | null;
  upper?: number | null;
  value?: number | null;
}
