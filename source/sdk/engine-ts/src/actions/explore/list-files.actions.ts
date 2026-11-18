"use server";

/**
 * A folder's entries; a file path lists the folder that holds it.
 *
 * GET /v1/explore/files
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ExploreListing } from "#sdk/types/explore/listing.ts";

export type ListFilesInput = ActionInput<never, { root?: string; path?: string }, never>;

export async function listFiles(input: ListFilesInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/explore/files";
  return api.get<ExploreListing>(path, options);
}
