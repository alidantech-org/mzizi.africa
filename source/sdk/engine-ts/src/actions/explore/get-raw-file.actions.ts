"use server";

/**
 * The bytes of one file (up to 16 MB) for preview and download, as base64 with its content type.
 *
 * GET /v1/explore/file/data
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ExploreRawFile } from "#sdk/types/explore/raw-file.ts";

export type GetRawFileInput = ActionInput<never, { root?: string; path?: string }, never>;

export async function getRawFile(input: GetRawFileInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/explore/file/data";
  return api.get<ExploreRawFile>(path, options);
}
