import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A person in public life. Display names are `identity.names`; name parts are `official.parts`. */
export interface OfficialIndividuals {
  birthDate?: string | null;
  birthYear?: number | null;
  code: string;
  createdAt: string;
  deathDate?: string | null;
  deathYear?: number | null;
  deletedAt?: string | null;
  id: string;
  identityKind: SharedIdentityKind;
  updatedAt: string;
  version: number;
}
