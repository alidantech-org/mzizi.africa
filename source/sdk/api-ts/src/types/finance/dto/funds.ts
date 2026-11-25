import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A public fund (NG-CDF). */
export interface FinanceFunds {
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  identityKind: SharedIdentityKind;
  kindTerm: string;
  managerId?: string | null;
  scopeId?: string | null;
  sourceTerm?: string | null;
  updatedAt: string;
  version: number;
}
