import { SharedDatePrecision } from "#sdk/types/enums/shared/date-precision.ts";

/** Base for versioned records with a unique identity code and a period of integer years. */
export interface SharedCodedPeriodEntity {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
