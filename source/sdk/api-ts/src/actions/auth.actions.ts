"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { AuthAccountCollection } from "#sdk/types/auth/dto/account-collection.ts";
import type { AuthAccountRead } from "#sdk/types/auth/dto/account-read.ts";
import type { AuthAccountWindow } from "#sdk/types/auth/dto/account-window.ts";
/** GET /v1/account */
export type AuthGetMyAccountActionInput = ActionInput<never, never, never>;

export async function authGetMyAccount(input: AuthGetMyAccountActionInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.auth.getMyAccount;
  return api.get<AuthAccountRead>(path, options);
}
/** GET /v1/admin/accounts */
export type AuthListAccountsActionInput = ActionInput<never, AuthAccountWindow, never>;

export async function authListAccounts(input: AuthListAccountsActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.auth.listAccounts;
  return api.get<AuthAccountCollection>(path, options);
}
