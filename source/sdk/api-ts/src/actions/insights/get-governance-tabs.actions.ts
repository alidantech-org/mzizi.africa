"use server";

/**
 * The ways to look at leaders (elected, nominated, appointed) and the bodies to switch to, all read from the reference schemes.
 *
 * GET /v1/governance/tabs
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsGovernanceTabs } from "#sdk/types/insights/governance-tabs.ts";

export type GetGovernanceTabsInput = ActionInput<never, never, never>;

export async function getGovernanceTabs(input: GetGovernanceTabsInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/governance/tabs";
  return api.get<InsightsGovernanceTabs>(path, options);
}
