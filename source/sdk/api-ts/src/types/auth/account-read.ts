import { AuthAccountStatus } from "#sdk/types/enums/auth/account-status.ts";
import { AuthAuthActorKind } from "#sdk/types/enums/auth/auth-actor-kind.ts";

/** Account Read */
export interface AuthAccountRead {
  actorKind: AuthAuthActorKind;
  displayName: string;
  id: string;
  lastAuthenticatedAt: string | null;
  status: AuthAccountStatus;
}
