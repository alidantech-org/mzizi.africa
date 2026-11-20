import { SharedDatePrecision } from "#sdk/types/shared/enums/date-precision.ts";

/** Base for versioned records with a period of integer years and one precision for the pair. */
export interface SharedPeriodEntity {
  createdAt: string;
  deletedAt?: string | null;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
