"use server";

/**
 * One page of a raw table, with search and sorting.
 *
 * GET /v1/explore/db/tables/{domain}/{table}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ExploreTablePage } from "#sdk/types/explore/table-page.ts";

export type GetTablePageInput = ActionInput<
  { domain: string; table: string },
  { limit?: number; offset?: number; order?: string; direction?: string; q?: string },
  never
>;

export async function getTablePage(input: GetTablePageInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = `/v1/explore/db/tables/${input.params.domain}/${input.params.table}`;
  return api.get<ExploreTablePage>(path, options);
}
