"use server";

/**
 * One page of a curated data list.
 *
 * GET /v1/explore/db/lists/{domain}/{code}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ExploreDataListPage } from "#sdk/types/explore/data-list-page.ts";

export type GetDataListPageInput = ActionInput<
  { domain: string; code: string },
  { limit?: number; offset?: number },
  never
>;

export async function getDataListPage(input: GetDataListPageInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = `/v1/explore/db/lists/${input.params.domain}/${input.params.code}`;
  return api.get<ExploreDataListPage>(path, options);
}
