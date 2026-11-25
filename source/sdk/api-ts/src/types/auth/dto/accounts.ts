import { AuthAccountStatus } from "#sdk/types/auth/enums/account-status.ts";
import { AuthAuthActorKind } from "#sdk/types/auth/enums/auth-actor-kind.ts";

/** A sign-in principal for a person, service or agent. */
export interface AuthAccounts {
  actorKind: AuthAuthActorKind;
  createdAt: string;
  disabledAt?: string | null;
  displayName: string;
  id: string;
  individualId?: string | null;
  lastAuthenticatedAt?: string | null;
  status: AuthAccountStatus;
}
