import { AuthMembershipStatus } from "#sdk/types/auth/enums/membership-status.ts";

/** An account's membership of an institution, verified and revocable with attribution. */
export interface AuthMemberships {
  accountId: string;
  endsAt?: string | null;
  id: string;
  institutionId: string;
  revokedAt?: string | null;
  revokedBy?: string | null;
  startsAt?: string | null;
  status: AuthMembershipStatus;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
}
