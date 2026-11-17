import { AuthMembershipStatus } from "#sdk/types/enums/auth/membership-status.ts";

/** Account membership of an institution, verified and revocable with attribution. */
export interface AuthMemberships {
  accountId: string;
  endsAt?: string | null;
  id: string;
  institutionRefId: string;
  revokedAt?: string | null;
  revokedBy?: string | null;
  startsAt?: string | null;
  status: AuthMembershipStatus;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
}
