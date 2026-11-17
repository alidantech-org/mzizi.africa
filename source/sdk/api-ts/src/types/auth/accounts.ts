import { AuthAccountStatus } from "#sdk/types/enums/auth/account-status.ts";
import { AuthAuthActorKind } from "#sdk/types/enums/auth/auth-actor-kind.ts";

/** Login principal for a person or service; identity is separate from the people and institutions it refers to. */
export interface AuthAccounts {
  actorKind: AuthAuthActorKind;
  createdAt: string;
  disabledAt?: string | null;
  displayName: string;
  id: string;
  lastAuthenticatedAt?: string | null;
  personRefId: string;
  status: AuthAccountStatus;
}
