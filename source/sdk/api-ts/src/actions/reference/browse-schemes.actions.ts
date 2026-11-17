"use server";

/**
 * Page through classification schemes in code order.
 *
 * GET /v1/reference/schemes
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { ReferenceSchemeCollection } from "#sdk/types/reference/scheme-collection.ts";
import type { ReferenceSchemeWindow } from "#sdk/types/reference/scheme-window.ts";

export type BrowseSchemesInput = ActionInput<never, ReferenceSchemeWindow, never>;

export async function browseSchemes(input: BrowseSchemesInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/reference/schemes";
  return api.get<ReferenceSchemeCollection>(path, options);
}
