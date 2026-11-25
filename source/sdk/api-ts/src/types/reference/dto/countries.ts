import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A modern country: facts only. Names are `identity.names`, regions are `identity.classifications`, its territory is the `geography.features` row sharing its identity. */
export interface ReferenceCountries {
  callingCode?: string | null;
  code: string;
  createdAt: string;
  currencyId?: string | null;
  deletedAt?: string | null;
  designationTerm?: string | null;
  establishedOn?: string | null;
  id: string;
  identityKind: SharedIdentityKind;
  isoAlpha2?: string | null;
  isoAlpha3?: string | null;
  isoNumeric?: string | null;
  recognitionTerm?: string | null;
  updatedAt: string;
  version: number;
}
