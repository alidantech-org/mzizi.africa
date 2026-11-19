"use server";

/**
 * How many likes a subject has, and whether this device has liked it. Views are counted and not returned.
 *
 * GET /v1/engagement
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InteractionsEngagementInput } from "#sdk/types/interactions/engagement-input.ts";
import type { InteractionsEngagement } from "#sdk/types/interactions/engagement.ts";

export type GetEngagementInput = ActionInput<never, InteractionsEngagementInput, never>;

export async function getEngagement(input: GetEngagementInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/engagement";
  return api.get<InteractionsEngagement>(path, options);
}
