"use server";

/**
 * Every schema with its tables and row counts.
 *
 * GET /v1/explore/db/domains
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ExploreDomainList } from "#sdk/types/explore/domain-list.ts";

export type ListDatabaseDomainsInput = ActionInput<never, never, never>;

export async function listDatabaseDomains(input: ListDatabaseDomainsInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/explore/db/domains";
  return api.get<ExploreDomainList>(path, options);
}
