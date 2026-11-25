import { SharedFigureBasis } from "#sdk/types/shared/enums/figure-basis.ts";
import { SharedFigureStatus } from "#sdk/types/shared/enums/figure-status.ts";

/** One published figure for an indicator, place, subject, period and breakdown cell, by collection and revision. */
export interface StatisticsObservations {
  basis: SharedFigureBasis;
  cell: string;
  collectionId?: string | null;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  featureId: string;
  fromYear?: number | null;
  id: string;
  indicatorId: string;
  lower?: number | null;
  revision: number;
  startsOn?: string | null;
  status: SharedFigureStatus;
  subjectId?: string | null;
  supersedesId?: string | null;
  toYear?: number | null;
  updatedAt: string;
  upper?: number | null;
  value?: number | null;
  version: number;
}
