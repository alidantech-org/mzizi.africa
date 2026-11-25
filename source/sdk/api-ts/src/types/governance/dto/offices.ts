import { SharedIdentityKind } from "#sdk/types/shared/enums/identity-kind.ts";

/** One concrete seat (the Governor of Nairobi, the MCA for Kilimani ward). */
export interface GovernanceOffices {
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  endsOn?: string | null;
  featureId?: string | null;
  fromYear?: number | null;
  id: string;
  identityKind: SharedIdentityKind;
  institutionId: string;
  positionId: string;
  seat?: string | null;
  startsOn?: string | null;
  toYear?: number | null;
  updatedAt: string;
  version: number;
}
