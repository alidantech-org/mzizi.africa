
import type { MembershipStatus } from "#/modules/auth/membership-status.enum.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Account membership of an institution, verified and revocable with attribution. */
export interface Memberships {
  accountId: Id;
  endsAt?: Instant | null;
  id: Id;
  institutionRefId: Id;
  revokedAt?: Instant | null;
  revokedBy?: Id | null;
  startsAt?: Instant | null;
  status: MembershipStatus;
  verifiedAt?: Instant | null;
  verifiedBy?: Id | null;
}