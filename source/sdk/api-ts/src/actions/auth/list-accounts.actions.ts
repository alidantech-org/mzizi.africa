"use server";

/**
 * Page through accounts, optionally by status. Administrators only.
 *
 * GET /v1/admin/accounts
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { AuthAccountCollection } from "#sdk/types/auth/account-collection.ts";
import type { AuthAccountWindow } from "#sdk/types/auth/account-window.ts";

export type ListAccountsInput = ActionInput<never, AuthAccountWindow, never>;

export async function listAccounts(input: ListAccountsInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/admin/accounts";
  return api.get<AuthAccountCollection>(path, options);
}
