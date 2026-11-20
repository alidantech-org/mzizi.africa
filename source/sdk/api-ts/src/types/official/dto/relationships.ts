import { SharedDatePrecision } from "#sdk/types/shared/enums/date-precision.ts";

/** One directed typed relationship between exactly two Official identities, optionally with an ownership share. */
export interface OfficialRelationships {
  code: string;
  confidence?: number | null;
  createdAt: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  evidenceBasisId?: string | null;
  evidenceStatusId?: string | null;
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
