"use server";

/**
 * Every term group, with its canonical terms.
 *
 * GET /v1/explore/terms
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ExploreTermGroupList } from "#sdk/types/explore/term-group-list.ts";

export type ListTermGroupsInput = ActionInput<never, never, never>;

export async function listTermGroups(input: ListTermGroupsInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/explore/terms";
  return api.get<ExploreTermGroupList>(path, options);
}
