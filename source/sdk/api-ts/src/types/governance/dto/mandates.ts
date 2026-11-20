import { SharedDatePrecision } from "#sdk/types/shared/enums/date-precision.ts";

/** One responsibility or authority assignment for an institution or office. */
export interface GovernanceMandates {
  createdAt: string;
  deletedAt?: string | null;
  description: string;
  endsOn?: string | null;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  institutionId?: string | null;
  mandateKindId: string;
  officeId?: string | null;
  sourceCitationId?: string | null;
  startsOn?: string | null;
  termId?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
