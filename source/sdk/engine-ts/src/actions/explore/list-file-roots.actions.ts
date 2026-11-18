"use server";

/**
 * The folders the explorer may show.
 *
 * GET /v1/explore/roots
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ExploreRootList } from "#sdk/types/explore/root-list.ts";

export type ListFileRootsInput = ActionInput<never, never, never>;

export async function listFileRoots(input: ListFileRootsInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/explore/roots";
  return api.get<ExploreRootList>(path, options);
}
