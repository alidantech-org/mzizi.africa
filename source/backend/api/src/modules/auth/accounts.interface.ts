
import type { AccountStatus } from "#/modules/auth/account-status.enum.ts";
import type { AuthActorKind } from "#/modules/auth/auth-actor-kind.enum.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Login principal for a person or service; identity is separate from the people and institutions it refers to. */
export interface Accounts {
  actorKind: AuthActorKind;
  createdAt: Instant;
  disabledAt?: Instant | null;
  displayName: NonEmptyString255;
  id: Id;
  lastAuthenticatedAt?: Instant | null;
  personRefId: Id;
  status: AccountStatus;
}