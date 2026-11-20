import { SharedDatePrecision } from "#sdk/types/shared/enums/date-precision.ts";

/** A recurring yearly window, natural or human: the long rains, a planting season, a school term, for a country or a place. Gives the calendar its seasonal context and explains recurring patterns in data. */
export interface EventSeasons {
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  description?: string | null;
  endDay?: number | null;
  endMonth: number;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  isNatural: boolean;
  scopeFeatureId?: string | null;
  seasonKindId: string;
  sourceCitationId?: string | null;
  startDay?: number | null;
  startMonth: number;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
