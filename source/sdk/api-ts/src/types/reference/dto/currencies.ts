import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A currency with its ISO codes and minor units; currencies end and are replaced. */
export interface ReferenceCurrencies {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  fromYear?: number | null;
  id: string;
  identityKind: SharedIdentityKind;
  isoCode?: string | null;
  isoNumeric?: string | null;
  minorUnits: number;
  replacedById?: string | null;
  symbol?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
