import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A public institution; it shares its organisation's identity (`official.entities`). Committees are institutions linked to their house. */
export interface GovernanceInstitutions {
  armTerm?: string | null;
  basisTerm?: string | null;
  classTerm?: string | null;
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  fromYear?: number | null;
  id: string;
  identityKind: SharedIdentityKind;
  kindTerm: string;
  startsOn?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
