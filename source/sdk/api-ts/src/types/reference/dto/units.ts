import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A unit of measurement and its exact conversion to a base unit; never a spatial unit. */
export interface ReferenceUnits {
  baseId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  identityKind: SharedIdentityKind;
  offset: number;
  quantityTerm: string;
  scale: number;
  symbol: string;
  updatedAt: string;
  version: number;
}
