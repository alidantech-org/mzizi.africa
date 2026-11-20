"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { GeographyFeatureCollection } from "#sdk/types/geography/dto/feature-collection.ts";
import type { GeographyFeatureDetail } from "#sdk/types/geography/dto/feature-detail.ts";
import type { GeographyFeatureGeometryCollection } from "#sdk/types/geography/dto/feature-geometry-collection.ts";
import type { GeographyFeatureKindCollection } from "#sdk/types/geography/dto/feature-kind-collection.ts";
import type { GeographyFeatureWindow } from "#sdk/types/geography/dto/feature-window.ts";
import type { GeographyGeometryWindow } from "#sdk/types/geography/dto/geometry-window.ts";
/** GET /v1/geography/feature-kinds */
export type GeographyBrowseFeatureKindsActionInput = ActionInput<never, never, never>;

export async function geographyBrowseFeatureKinds(
  input: GeographyBrowseFeatureKindsActionInput = {},
) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.geography.browseFeatureKinds;
  return api.get<GeographyFeatureKindCollection>(path, options);
}
/** GET /v1/geography/features */
export type GeographyBrowseFeaturesActionInput = ActionInput<never, GeographyFeatureWindow, never>;

export async function geographyBrowseFeatures(input: GeographyBrowseFeaturesActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.geography.browseFeatures;
  return api.get<GeographyFeatureCollection>(path, options);
}
/** GET /v1/geography/geometries */
export type GeographyBrowseGeometriesActionInput = ActionInput<
  never,
  GeographyGeometryWindow,
  never
>;

export async function geographyBrowseGeometries(input: GeographyBrowseGeometriesActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.geography.browseGeometries;
  return api.get<GeographyFeatureGeometryCollection>(path, options);
}
/** GET /v1/geography/features/{featureId} */
export type GeographyGetFeatureActionInput = ActionInput<{ featureId: string }, never, never>;

export async function geographyGetFeature(input: GeographyGetFeatureActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.geography.getFeature(input.params);
  return api.get<GeographyFeatureDetail>(path, options);
}
/** GET /v1/geography/features/{featureId}/geometries */
export type GeographyListFeatureGeometriesActionInput = ActionInput<
  { featureId: string },
  never,
  never
>;

export async function geographyListFeatureGeometries(
  input: GeographyListFeatureGeometriesActionInput,
) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.geography.listFeatureGeometries(input.params);
  return api.get<GeographyFeatureGeometryCollection>(path, options);
}
