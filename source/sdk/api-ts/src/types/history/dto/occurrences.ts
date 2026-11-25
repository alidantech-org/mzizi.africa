import { SharedDatePrecision } from "#sdk/types/shared/enums/date-precision.ts";
import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A historical occurrence of significance (Kenya's independence, the 2010 constitution, devolution in 2013). */
export interface HistoryOccurrences {
  code: string;
  countryId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  fromYear?: number | null;
  id: string;
  identityKind: SharedIdentityKind;
  kindTerm: string;
  precision: SharedDatePrecision;
  startsOn?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
