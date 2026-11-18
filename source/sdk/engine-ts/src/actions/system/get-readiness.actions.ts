"use server";

/**
 * Readiness: each dependency and whether it answers.
 *
 * GET /ready
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { SystemReadiness } from "#sdk/types/system/readiness.ts";

export type GetReadinessInput = ActionInput<never, never, never>;

export async function getReadiness(input: GetReadinessInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/ready";
  return api.get<SystemReadiness>(path, options);
}
