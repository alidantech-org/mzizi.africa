import { AuthAccountStatus } from "#sdk/types/enums/auth/account-status.ts";

/** Account Window */
export interface AuthAccountWindow {
  limit?: number;
  offset?: number;
  status?: AuthAccountStatus;
}
