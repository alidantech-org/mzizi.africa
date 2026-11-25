import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** An election or referendum. Its names are `identity.names`. */
export interface ElectionElections {
  authorityId?: string | null;
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  eventId?: string | null;
  fromYear: number;
  heldOn?: string | null;
  id: string;
  identityKind: SharedIdentityKind;
  kindTerm: string;
  parentId?: string | null;
  statusTerm: string;
  termId?: string | null;
  updatedAt: string;
  version: number;
}
