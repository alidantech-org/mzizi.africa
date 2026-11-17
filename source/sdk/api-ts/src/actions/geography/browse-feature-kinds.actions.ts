"use server";

/**
 * The kinds a geographic feature can have, in code order, for choosing a feature type.
 *
 * GET /v1/geography/feature-kinds
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { GeographyFeatureKindCollection } from "#sdk/types/geography/feature-kind-collection.ts";

export type BrowseFeatureKindsInput = ActionInput<never, never, never>;

export async function browseFeatureKinds(input: BrowseFeatureKindsInput = {}) {
  const options = requestOptions(input.options, undefined, false);
  const path = "/v1/geography/feature-kinds";
  return api.get<GeographyFeatureKindCollection>(path, options);
}
