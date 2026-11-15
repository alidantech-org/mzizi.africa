
import type { AccountStatus } from "#/modules/auth/schema/enum/account-status.enum.ts";
import type { AuthActorKind } from "#/modules/auth/schema/enum/auth-actor-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Account Read */
export interface AccountRead {
  actorKind: AuthActorKind;
  displayName: NonEmptyString255;
  id: Id;
  lastAuthenticatedAt: Instant | null;
  status: AccountStatus;
}