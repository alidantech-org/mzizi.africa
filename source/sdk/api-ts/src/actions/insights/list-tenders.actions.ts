"use server";

/**
 * Tenders and contracts: open, ongoing, closed, awarded and complete, with suppliers, plus transparency information.
 *
 * GET /v1/tenders
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsTenderInput } from "#sdk/types/insights/tender-input.ts";
import type { InsightsTenderList } from "#sdk/types/insights/tender-list.ts";

export type ListTendersInput = ActionInput<never, InsightsTenderInput, never>;

export async function listTenders(input: ListTendersInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/tenders";
  return api.get<InsightsTenderList>(path, options);
}
