"use server";

/**
 * One explanatory text by its address or by the record it is about, with image references resolved to addresses.
 *
 * GET /v1/content
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsContentInput } from "#sdk/types/insights/content-input.ts";
import type { InsightsContentPage } from "#sdk/types/insights/content-page.ts";

export type GetContentInput = ActionInput<never, InsightsContentInput, never>;

export async function getContent(input: GetContentInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/content";
  return api.get<InsightsContentPage>(path, options);
}
