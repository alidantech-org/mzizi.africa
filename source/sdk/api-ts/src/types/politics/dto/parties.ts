import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A political party; it shares its organisation's identity (`official.entities`). */
export interface PoliticsParties {
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
