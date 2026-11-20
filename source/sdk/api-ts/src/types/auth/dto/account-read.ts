import { AuthAccountStatus } from "#sdk/types/auth/enums/account-status.ts";
import { AuthAuthActorKind } from "#sdk/types/auth/enums/auth-actor-kind.ts";

/** Account Read */
export interface AuthAccountRead {
  actorKind: AuthAuthActorKind;
  displayName: string;
  id: string;
  lastAuthenticatedAt: string | null;
  status: AuthAccountStatus;
}
