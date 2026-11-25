import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** Public identifiers of named things (ISO codes, IEBC codes, Wikidata ids, registration numbers). Personal identifiers such as national ID numbers are never stored. */
export interface IdentityIdentifiers {
  createdAt: string;
  deletedAt?: string | null;
  fromYear?: number | null;
  id: string;
  identityId: string;
  identityKind: SharedIdentityKind;
  issuerId?: string | null;
  namespace?: string | null;
  schemeTerm: string;
  toYear?: number | null;
  updatedAt: string;
  value: string;
  version: number;
}
