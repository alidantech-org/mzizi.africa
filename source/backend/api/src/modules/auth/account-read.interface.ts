
import type { AccountStatus } from "#/modules/auth/account-status.enum.ts";
import type { AuthActorKind } from "#/modules/auth/auth-actor-kind.enum.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Account Read */
export interface AccountRead {
  actorKind: AuthActorKind;
  displayName: NonEmptyString255;
  id: Id;
  lastAuthenticatedAt: Instant | null;
  status: AccountStatus;
}