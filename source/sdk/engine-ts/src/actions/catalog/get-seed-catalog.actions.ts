"use server";

/**
 * Read the generated seed contract catalog, optionally filtered by table.
 *
 * GET /v1/catalog/seed-tables
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { CatalogSeedCatalog } from "#sdk/types/catalog/seed-catalog.ts";

export type GetSeedCatalogInput = ActionInput<never, { table?: string }, never>;

export async function getSeedCatalog(input: GetSeedCatalogInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/catalog/seed-tables";
  return api.get<CatalogSeedCatalog>(path, options);
}
