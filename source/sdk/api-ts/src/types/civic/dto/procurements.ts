import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A tender. Its title is an `identity.names` row and its tender number an `identity.identifiers` row. */
export interface CivicProcurements {
  amount?: number | null;
  bidderCount?: number | null;
  buyerId: string;
  categoryTerm: string;
  closesOn?: string | null;
  code: string;
  countryId: string;
  createdAt: string;
  currencyId?: string | null;
  deletedAt?: string | null;
  evaluationTerm?: string | null;
  id: string;
  identityKind: SharedIdentityKind;
  natureTerm?: string | null;
  procedureTerm: string;
  projectId?: string | null;
  publishedOn?: string | null;
  statusTerm: string;
  updatedAt: string;
  version: number;
}
