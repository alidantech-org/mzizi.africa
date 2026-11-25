import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A publisher's series (the Economic Survey). Its titles are `identity.names`. */
export interface SourceProducts {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  identityKind: SharedIdentityKind;
  kindTerm: string;
  publisherId?: string | null;
  updatedAt: string;
  version: number;
}
