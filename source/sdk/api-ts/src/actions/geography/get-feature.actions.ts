"use server";

/**
 * One geographic feature with its names.
 *
 * GET /v1/geography/features/{featureId}
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { GeographyFeatureDetail } from "#sdk/types/geography/feature-detail.ts";

export type GetFeatureInput = ActionInput<{ featureId: string }, never, never>;

export async function getFeature(input: GetFeatureInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/geography/features/${input.params.featureId}`;
  return api.get<GeographyFeatureDetail>(path, options);
}
