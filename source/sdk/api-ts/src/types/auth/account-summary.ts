import { AuthAccountStatus } from "#sdk/types/enums/auth/account-status.ts";
import { AuthAuthActorKind } from "#sdk/types/enums/auth/auth-actor-kind.ts";

/** Account Summary */
export interface AuthAccountSummary {
  actorKind: AuthAuthActorKind;
  displayName: string;
  id: string;
  status: AuthAccountStatus;
}
