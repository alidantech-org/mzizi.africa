import { SharedDatePrecision } from "#sdk/types/shared/enums/date-precision.ts";

/** One established public office, independent of any current holder and optionally scoped to a geographic unit. */
export interface GovernanceOffices {
  abolishedOn?: string | null;
  code: string;
  createdAt: string;
  createdOn?: string | null;
  deletedAt?: string | null;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  institutionId: string;
  positionId: string;
  seatOrdinal?: number | null;
  sourceCitationId?: string | null;
  toYear?: number | null;
  unitFeatureId?: string | null;
  updatedAt: string;
  version: number;
}
