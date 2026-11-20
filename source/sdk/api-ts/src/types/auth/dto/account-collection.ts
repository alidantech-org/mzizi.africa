import type { AuthAccountSummary } from "#sdk/types/auth/dto/account-summary.ts";

/** Account Collection */
export interface AuthAccountCollection {
  accounts: AuthAccountSummary[];
}
