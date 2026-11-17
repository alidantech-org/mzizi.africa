"use server";

/**
 * The current drawings whose envelope meets a map's bounds and whose zoom range includes the zoom, optionally of one feature type and simplified to a tolerance.
 *
 * GET /v1/geography/geometries
 */

import { api, type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import type { GeographyFeatureGeometryCollection } from "#sdk/types/geography/feature-geometry-collection.ts";
import type { GeographyGeometryWindow } from "#sdk/types/geography/geometry-window.ts";

export type BrowseGeometriesInput = ActionInput<never, GeographyGeometryWindow, never>;

export async function browseGeometries(input: BrowseGeometriesInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = "/v1/geography/geometries";
  return api.get<GeographyFeatureGeometryCollection>(path, options);
}
