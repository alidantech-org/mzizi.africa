import { SharedDatePrecision } from "#sdk/types/enums/shared/date-precision.ts";

/** A typed, dated directed relationship between features; separate rows allow overlapping administrative, electoral, statistical and other systems. */
export interface GeographyRelationships {
  createdAt: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  objectFeatureId: string;
  relationshipKindId: string;
  startsOn?: string | null;
  subjectFeatureId: string;
  systemId: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
