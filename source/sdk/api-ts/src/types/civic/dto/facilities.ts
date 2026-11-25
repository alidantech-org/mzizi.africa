import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A public facility; it shares its geography feature's identity, so "near me" is a spatial query on the feature. */
export interface CivicFacilities {
  classTerm: string;
  code: string;
  countryId: string;
  createdAt: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  fromYear?: number | null;
  id: string;
  identityKind: SharedIdentityKind;
  institutionId?: string | null;
  operatorId?: string | null;
  ownerId?: string | null;
  ownershipTerm?: string | null;
  startsOn?: string | null;
  statusTerm?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
