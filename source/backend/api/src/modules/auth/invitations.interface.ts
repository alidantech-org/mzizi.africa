
import type { Email } from "#/modules/shared/email.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { Sha256 } from "#/modules/shared/sha256.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Single-use invitation to an institution; only a digest of the token is stored. */
export interface Invitations {
  acceptedAccountId?: Id | null;
  acceptedAt?: Instant | null;
  createdAt: Instant;
  expiresAt?: Instant | null;
  id: Id;
  institutionRefId: Id;
  intendedEmail: Email;
  invitedBy: Id;
  revokedAt?: Instant | null;
  tokenDigest: Sha256;
}