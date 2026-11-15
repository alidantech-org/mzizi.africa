
import type { AccountSummary } from "#/modules/auth/schema/interface/account-summary.interface.ts";

/** Account Collection */
export interface AccountCollection {
  accounts: AccountSummary[];
}