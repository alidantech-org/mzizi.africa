import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A Mzizi application: web, app or dev. Its names are `identity.names`. */
export interface ProductApps {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  identityKind: SharedIdentityKind;
  updatedAt: string;
  version: number;
}
