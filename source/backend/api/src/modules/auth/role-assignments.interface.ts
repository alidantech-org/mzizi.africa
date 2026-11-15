
import type { Description } from "#/modules/shared/description.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Scoped role grant to an account, optionally through a membership or delegation, with revocation history. */
export interface RoleAssignments {
  accountId: Id;
  createdAt: Instant;
  delegationId?: Id | null;
  expiresAt?: Instant | null;
  grantedBy: Id;
  id: Id;
  membershipId?: Id | null;
  revocationReason?: Description | null;
  revokedAt?: Instant | null;
  revokedBy?: Id | null;
  roleId: Id;
  scopeId: Id;
  startsAt?: Instant | null;
}