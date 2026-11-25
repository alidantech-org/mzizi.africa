import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** One way a country divides itself for a period (Kenya administrative 1963–2013, Kenya administrative 2013–, Kenya electoral). Places are geography features linked through `geography.relationships`. */
export interface ReferenceHierarchies {
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  fromYear?: number | null;
  id: string;
  identityKind: SharedIdentityKind;
  isRouting: boolean;
  kindTerm: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
