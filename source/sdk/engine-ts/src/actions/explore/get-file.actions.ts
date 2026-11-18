"use server";

/**
 * One file viewed by kind: text, CSV rows, parsed JSON or YAML.
 *
 * GET /v1/explore/file
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ExploreFileView } from "#sdk/types/explore/file-view.ts";

export type GetFileInput = ActionInput<
  never,
  { root?: string; path?: string; offset?: number; limit?: number },
  never
>;

export async function getFile(input: GetFileInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/explore/file";
  return api.get<ExploreFileView>(path, options);
}
