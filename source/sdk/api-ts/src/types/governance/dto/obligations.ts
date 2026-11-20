import { SharedDatePrecision } from "#sdk/types/shared/enums/date-precision.ts";

/** A duty to report or publish, with who owes it, to whom, how often and the law that creates it. Each filing found is a report. */
export interface GovernanceObligations {
  basisProvisionId?: string | null;
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  description: string;
  frequencyId: string;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  obligationKindId: string;
  obligorInstitutionId?: string | null;
  obligorKindId?: string | null;
  recipientEntityId?: string | null;
  sourceCitationId?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
