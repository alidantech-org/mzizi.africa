"use server";

/**
 * The current drawings of one feature, each with its role, basis, revision, confidence, zoom range and validity. A feature with no drawing returns an empty list.
 *
 * GET /v1/geography/features/{featureId}/geometries
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { GeographyFeatureGeometryCollection } from "#sdk/types/geography/feature-geometry-collection.ts";

export type ListFeatureGeometriesInput = ActionInput<{ featureId: string }, never, never>;

export async function listFeatureGeometries(input: ListFeatureGeometriesInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = `/v1/geography/features/${input.params.featureId}/geometries`;
  return api.get<GeographyFeatureGeometryCollection>(path, options);
}
