import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** An organisation. Institutions, parties and publishers share their organisation's identity; regional bodies (EAC, AU) are entities with dated memberships. */
export interface OfficialEntities {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  dissolvedOn?: string | null;
  fromYear?: number | null;
  id: string;
  identityKind: SharedIdentityKind;
  kindTerm: string;
  registeredOn?: string | null;
  registrationCountryId?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
