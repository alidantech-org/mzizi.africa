"use server";

/**
 * Browse geographic features with their names, optionally of one type or by code prefix.
 *
 * GET /v1/geography/features
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { GeographyFeatureCollection } from "#sdk/types/geography/feature-collection.ts";
import type { GeographyFeatureWindow } from "#sdk/types/geography/feature-window.ts";

export type BrowseFeaturesInput = ActionInput<never, GeographyFeatureWindow, never>;

export async function browseFeatures(input: BrowseFeaturesInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/geography/features";
  return api.get<GeographyFeatureCollection>(path, options);
}
