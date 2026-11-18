"use server";

/**
 * One motion with the position of every member (yes, no, abstained, absent), the law or budget it concerns and the tally.
 *
 * GET /v1/motions/{code}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsMotionDetail } from "#sdk/types/insights/motion-detail.ts";

export type GetMotionInput = ActionInput<{ code: string }, never, never>;

export async function getMotion(input: GetMotionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/motions/${input.params.code}`;
  return api.get<InsightsMotionDetail>(path, options);
}
