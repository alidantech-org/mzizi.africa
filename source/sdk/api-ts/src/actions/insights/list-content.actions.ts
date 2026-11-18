"use server";

/**
 * Explanatory texts by category or tag, for the Learn section.
 *
 * GET /v1/content/list
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsContentListInput } from "#sdk/types/insights/content-list-input.ts";
import type { InsightsContentList } from "#sdk/types/insights/content-list.ts";

export type ListContentInput = ActionInput<never, InsightsContentListInput, never>;

export async function listContent(input: ListContentInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/content/list";
  return api.get<InsightsContentList>(path, options);
}
