
import type { Id } from "#/modules/shared/id.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/non-empty-string500.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** External issuer and subject linked to one account; unlinking is recorded, never deleted. */
export interface LoginIdentities {
  accountId: Id;
  id: Id;
  issuer: NonEmptyString500;
  lastAuthenticatedAt?: Instant | null;
  linkedAt: Instant;
  subject: NonEmptyString500;
  unlinkedAt?: Instant | null;
}