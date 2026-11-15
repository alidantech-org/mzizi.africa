
import type { Id } from "#/modules/shared/id.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Time-limited delegation of scoped access from one account to another. */
export interface Delegations {
  createdAt: Instant;
  delegateAccountId: Id;
  delegatorAccountId: Id;
  expiresAt?: Instant | null;
  id: Id;
  revokedAt?: Instant | null;
  revokedBy?: Id | null;
  scopeId: Id;
  startsAt?: Instant | null;
}