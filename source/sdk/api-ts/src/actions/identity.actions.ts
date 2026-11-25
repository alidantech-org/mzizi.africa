"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { IdentityAddressKey } from "#sdk/types/identity/dto/address-key.ts";
import type { IdentityAddressMatches } from "#sdk/types/identity/dto/address-matches.ts";
import type { IdentityIdentityDetail } from "#sdk/types/identity/dto/identity-detail.ts";
import type { IdentityNameMatches } from "#sdk/types/identity/dto/name-matches.ts";
import type { IdentityNameSearch } from "#sdk/types/identity/dto/name-search.ts";
/** GET /v1/identity/things/{code} */
export type IdentityGetIdentityActionInput = ActionInput<{ code: string }, never, never>;

export async function identityGetIdentity(input: IdentityGetIdentityActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.identity.getIdentity(input.params);
  return api.get<IdentityIdentityDetail>(path, options);
}
/** GET /v1/identity/addresses */
export type IdentityResolveAddressActionInput = ActionInput<never, IdentityAddressKey, never>;

export async function identityResolveAddress(input: IdentityResolveAddressActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.identity.resolveAddress;
  return api.get<IdentityAddressMatches>(path, options);
}
/** GET /v1/identity/search */
export type IdentitySearchNamesActionInput = ActionInput<never, IdentityNameSearch, never>;

export async function identitySearchNames(input: IdentitySearchNamesActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.identity.searchNames;
  return api.get<IdentityNameMatches>(path, options);
}
