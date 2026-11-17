"use server";

/**
 * The signed-in person's own account.
 *
 * GET /v1/account
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { AuthAccountRead } from "#sdk/types/auth/account-read.ts";

export type GetMyAccountInput = ActionInput<never, never, never>;

export async function getMyAccount(input: GetMyAccountInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/account";
  return api.get<AuthAccountRead>(path, options);
}
