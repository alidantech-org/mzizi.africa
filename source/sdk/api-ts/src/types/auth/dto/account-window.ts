import { AuthAccountStatus } from "#sdk/types/auth/enums/account-status.ts";

/** Account Window */
export interface AuthAccountWindow {
  limit?: number;
  offset?: number;
  status?: AuthAccountStatus;
}
