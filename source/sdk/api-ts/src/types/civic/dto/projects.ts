import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A public project. Its names and descriptions are `identity.names`; its places are `civic.sites`. */
export interface CivicProjects {
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  fromYear?: number | null;
  id: string;
  identityKind: SharedIdentityKind;
  implementerId?: string | null;
  institutionId?: string | null;
  scopeId?: string | null;
  sponsorId?: string | null;
  startsOn?: string | null;
  statusTerm: string;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
