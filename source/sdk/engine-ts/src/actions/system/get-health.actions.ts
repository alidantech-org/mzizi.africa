"use server";

/**
 * Liveness: the process is up.
 *
 * GET /health
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { SystemHealth } from "#sdk/types/system/health.ts";

export type GetHealthInput = ActionInput<never, never, never>;

export async function getHealth(input: GetHealthInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/health";
  return api.get<SystemHealth>(path, options);
}
