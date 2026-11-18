"use server";

/**
 * Motions, bills and decisions of public bodies, newest first.
 *
 * GET /v1/motions
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsMotionList } from "#sdk/types/insights/motion-list.ts";
import type { InsightsMotionsInput } from "#sdk/types/insights/motions-input.ts";

export type ListMotionsInput = ActionInput<never, InsightsMotionsInput, never>;

export async function listMotions(input: ListMotionsInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/motions";
  return api.get<InsightsMotionList>(path, options);
}
