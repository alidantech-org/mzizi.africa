import { SharedDatePrecision } from "#sdk/types/enums/shared/date-precision.ts";

/** A kind of office with its seat rule: how it is filled, how many seats exist and where, the term, the legal basis. Offices are the individual seats of a position; holders are never part of it. */
export interface GovernancePositions {
  basisProvisionId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  displayOrder?: number | null;
  exposureId?: string | null;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  institutionId: string;
  jurisdictionLevelId?: string | null;
  roleId: string;
  seatBasisId: string;
  seatCount?: number | null;
  seatUnitLevelId?: string | null;
  selectionMethodId: string;
  sourceCitationId?: string | null;
  termLimit?: number | null;
  termYears?: number | null;
  titleId: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
