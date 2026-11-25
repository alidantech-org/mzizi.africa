import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** A kind of seat that law creates (Governor, Member of County Assembly). Its titles are `identity.names`. */
export interface GovernancePositions {
  basisTerm?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  exposureTerm?: string | null;
  id: string;
  identityKind: SharedIdentityKind;
  institutionId?: string | null;
  levelId?: string | null;
  methodTerm?: string | null;
  position?: number | null;
  provisionId?: string | null;
  roleTerm: string;
  seatCount?: number | null;
  seatLevelId?: string | null;
  termLimit?: number | null;
  termYears?: number | null;
  updatedAt: string;
  version: number;
}
