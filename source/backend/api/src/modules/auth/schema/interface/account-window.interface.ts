import type { AccountStatus } from "#/modules/auth/schema/enum/account-status.enum.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Account Window */
export interface AccountWindow {
  limit?: Integer;
  offset?: Integer;
  status?: AccountStatus;
}
