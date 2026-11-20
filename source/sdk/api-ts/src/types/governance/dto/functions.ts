import { SharedDatePrecision } from "#sdk/types/shared/enums/date-precision.ts";

/** A public function that a constitution or law assigns to a level of government. Its name and plain wording are copy keyed by code. */
export interface GovernanceFunctions {
  basisProvisionId?: string | null;
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  fromToPrecision?: SharedDatePrecision | null;
  fromYear?: number | null;
  id: string;
  parentFunctionId?: string | null;
  sourceCitationId?: string | null;
  toYear?: number | null;
  topicId?: string | null;
  updatedAt: string;
  version: number;
}
