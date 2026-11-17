import { SharedDatePrecision } from "#sdk/types/enums/shared/date-precision.ts";

/** One dated classification of a feature by a scheme value, so a feature can answer several classification questions and change over time. */
export interface GeographyClassifications {
  createdAt: string;
  deletedAt?: string | null;
  featureId: string;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  toYear?: number | null;
  updatedAt: string;
  valueId: string;
  version: number;
}
