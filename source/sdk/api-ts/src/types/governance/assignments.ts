import { SharedDatePrecision } from "#sdk/types/enums/shared/date-precision.ts";

/** Who is responsible for a function, how it is shared, where a person starts, and the law that assigns it. */
export interface GovernanceAssignments {
  basisProvisionId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  functionId: string;
  id: string;
  institutionId?: string | null;
  obligorKindId?: string | null;
  shareId: string;
  sourceCitationId?: string | null;
  startInstitutionId?: string | null;
  startPositionId?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
