import { AuthAccountStatus } from "#sdk/types/auth/enums/account-status.ts";
import { AuthAuthActorKind } from "#sdk/types/auth/enums/auth-actor-kind.ts";

/** Account Summary */
export interface AuthAccountSummary {
  actorKind: AuthAuthActorKind;
  displayName: string;
  id: string;
  status: AuthAccountStatus;
}
