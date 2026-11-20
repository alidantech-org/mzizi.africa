import { SharedDatePrecision } from "#sdk/types/shared/enums/date-precision.ts";

/** One right held in law by a position or body over another, with its place in a procedure, the threshold and the provision that creates it. Influence is computed from these rows, never stored. */
export interface GovernancePowers {
  basisProvisionId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  holderInstitutionId?: string | null;
  holderPositionId?: string | null;
  id: string;
  isBinding: boolean;
  kindId: string;
  procedureId?: string | null;
  sourceCitationId?: string | null;
  stepOrder?: number | null;
  targetInstitutionId?: string | null;
  targetPositionId?: string | null;
  thresholdId?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
