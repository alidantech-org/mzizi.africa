
import type { AccountStatus } from "#/modules/auth/account-status.enum.ts";
import type { Integer } from "#/modules/shared/integer.type.ts";

/** Account Window */
export interface AccountWindow {
  limit?: Integer;
  offset?: Integer;
  status?: AccountStatus;
}