"use server";

/**
 * The Constitution articles and Acts that establish, authorise or govern one record (a body, an office, a place).
 *
 * GET /v1/legal-basis
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { InsightsLegalBasisInput } from "#sdk/types/insights/legal-basis-input.ts";
import type { InsightsLegalBasis } from "#sdk/types/insights/legal-basis.ts";

export type GetLegalBasisInput = ActionInput<never, InsightsLegalBasisInput, never>;

export async function getLegalBasis(input: GetLegalBasisInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/legal-basis";
  return api.get<InsightsLegalBasis>(path, options);
}
