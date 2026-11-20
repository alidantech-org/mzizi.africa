import { SharedDatePrecision } from "#sdk/types/shared/enums/date-precision.ts";

/** The sole canonical identity for each geographic entity, whatever its type. Country, parentage and administrative or electoral membership are dated relationships, never columns here. */
export interface GeographyFeatures {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  endedOn?: string | null;
  establishedOn?: string | null;
  featureTypeId: string;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
