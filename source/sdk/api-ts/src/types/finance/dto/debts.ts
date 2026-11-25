import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A public debt (a loan or bond). */
export interface FinanceDebts {
  amount?: number | null;
  borrowerId: string;
  code: string;
  contractedOn?: string | null;
  countryId: string;
  createdAt: string;
  currencyId?: string | null;
  deletedAt?: string | null;
  id: string;
  identityKind: SharedIdentityKind;
  kindTerm: string;
  lenderId: string;
  maturityOn?: string | null;
  updatedAt: string;
  version: number;
}
