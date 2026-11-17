import { SharedDatePrecision } from "#sdk/types/enums/shared/date-precision.ts";

/** One directed typed relationship between exactly two Official identities, optionally with an ownership share. */
export interface OfficialRelationships {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  fromEntityId?: string | null;
  fromIndividualId?: string | null;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  kindId: string;
  sharePercentage?: number | null;
  sourceCitationId?: string | null;
  startsOn?: string | null;
  toEntityId?: string | null;
  toIndividualId?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
