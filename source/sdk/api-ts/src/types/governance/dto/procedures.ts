import { SharedDatePrecision } from "#sdk/types/shared/enums/date-precision.ts";

/** A named sequence of rights, such as appointing a judge or removing a governor; its steps are powers. */
export interface GovernanceProcedures {
  basisProvisionId?: string | null;
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  description: string;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  kindId: string;
  sourceCitationId?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
