"use server";

/**
 * What the engine can run.
 *
 * GET /capabilities
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { EngineCapabilityList } from "#sdk/types/engine/capability-list.ts";

export type ListCapabilitiesInput = ActionInput<never, never, never>;

export async function listCapabilities(input: ListCapabilitiesInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/capabilities";
  return api.get<EngineCapabilityList>(path, options);
}
