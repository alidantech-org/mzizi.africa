import { SharedDatePrecision } from "#sdk/types/enums/shared/date-precision.ts";

/** One government institution specialization of an Official entity. */
export interface GovernanceInstitutions {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  dissolvedOn?: string | null;
  entityId: string;
  establishedOn?: string | null;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  institutionKindId: string;
  sourceCitationId?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
