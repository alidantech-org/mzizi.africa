"use server";

/**
 * Projects close to a position, nearest first, with status, who built them and the money, so a visitor sees what affects them.
 *
 * GET /v1/projects/near
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsNearbyInput } from "#sdk/types/insights/nearby-input.ts";
import type { InsightsNearbyProjects } from "#sdk/types/insights/nearby-projects.ts";

export type GetNearbyProjectsInput = ActionInput<never, InsightsNearbyInput, never>;

export async function getNearbyProjects(input: GetNearbyProjectsInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/projects/near";
  return api.get<InsightsNearbyProjects>(path, options);
}
