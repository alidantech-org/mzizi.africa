import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A coalition of parties (Azimio, Kenya Kwanza). */
export interface PoliticsCoalitions {
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
