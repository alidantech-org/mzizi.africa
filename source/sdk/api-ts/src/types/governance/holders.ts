import { SharedDatePrecision } from "#sdk/types/enums/shared/date-precision.ts";

/** One person's continuous tenure in one office, with appointment kind and effective dates. */
export interface GovernanceHolders {
  appointedByEntityId?: string | null;
  appointmentKindId: string;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  individualId: string;
  leftOfficeOn?: string | null;
  officeId: string;
  sourceCitationId?: string | null;
  toYear?: number | null;
  tookOfficeOn?: string | null;
  updatedAt: string;
  version: number;
}
