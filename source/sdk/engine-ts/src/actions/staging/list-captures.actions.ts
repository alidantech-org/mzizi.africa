"use server";

/**
 * Recent captures, newest first, optionally for one source.
 *
 * GET /v1/captures
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { StagingCaptureList } from "#sdk/types/staging/capture-list.ts";

export type ListCapturesInput = ActionInput<never, { sourceId?: string; limit?: number }, never>;

export async function listCaptures(input: ListCapturesInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/captures";
  return api.get<StagingCaptureList>(path, options);
}
