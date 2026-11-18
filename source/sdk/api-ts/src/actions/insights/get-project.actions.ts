"use server";

/**
 * One project: where, who is responsible, the money, the procurement, pictures and evidence.
 *
 * GET /v1/projects/{code}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsProjectDetail } from "#sdk/types/insights/project-detail.ts";

export type GetProjectInput = ActionInput<{ code: string }, never, never>;

export async function getProject(input: GetProjectInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/projects/${input.params.code}`;
  return api.get<InsightsProjectDetail>(path, options);
}
