"use server";

/**
 * The curated data lists, grouped by domain.
 *
 * GET /v1/explore/db/lists
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ExploreDataListList } from "#sdk/types/explore/data-list-list.ts";

export type ListDataListsInput = ActionInput<never, never, never>;

export async function listDataLists(input: ListDataListsInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/explore/db/lists";
  return api.get<ExploreDataListList>(path, options);
}
