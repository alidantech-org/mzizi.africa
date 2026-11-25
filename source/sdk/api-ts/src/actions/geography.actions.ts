"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { GeographyChildCollection } from "#sdk/types/geography/dto/child-collection.ts";
import type { GeographyChildOutlineCollection } from "#sdk/types/geography/dto/child-outline-collection.ts";
import type { GeographyChildWindow } from "#sdk/types/geography/dto/child-window.ts";
import type { GeographyFeatureWindow } from "#sdk/types/geography/dto/feature-window.ts";
import type { GeographyOutlineCollection } from "#sdk/types/geography/dto/outline-collection.ts";
import type { GeographyOutlineWindow } from "#sdk/types/geography/dto/outline-window.ts";
import type { GeographyPlaceAtPoint } from "#sdk/types/geography/dto/place-at-point.ts";
import type { GeographyPlaceCollection } from "#sdk/types/geography/dto/place-collection.ts";
import type { GeographyPlaceDetail } from "#sdk/types/geography/dto/place-detail.ts";
import type { GeographyPointQuery } from "#sdk/types/geography/dto/point-query.ts";
/** GET /v1/geography/at */
export type GeographyFindPlacesAtPointActionInput = ActionInput<never, GeographyPointQuery, never>;

export async function geographyFindPlacesAtPoint(input: GeographyFindPlacesAtPointActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.geography.findPlacesAtPoint;
  return api.get<GeographyPlaceAtPoint>(path, options);
}
/** GET /v1/geography/outlines */
export type GeographyGetOutlineActionInput = ActionInput<never, GeographyOutlineWindow, never>;

export async function geographyGetOutline(input: GeographyGetOutlineActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.geography.getOutline;
  return api.get<GeographyOutlineCollection>(path, options);
}
/** GET /v1/geography/places/{code} */
export type GeographyGetPlaceActionInput = ActionInput<{ code: string }, never, never>;

export async function geographyGetPlace(input: GeographyGetPlaceActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.geography.getPlace(input.params);
  return api.get<GeographyPlaceDetail>(path, options);
}
/** GET /v1/geography/child-outlines */
export type GeographyListChildOutlinesActionInput = ActionInput<never, GeographyChildWindow, never>;

export async function geographyListChildOutlines(input: GeographyListChildOutlinesActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.geography.listChildOutlines;
  return api.get<GeographyChildOutlineCollection>(path, options);
}
/** GET /v1/geography/children */
export type GeographyListChildrenActionInput = ActionInput<never, GeographyChildWindow, never>;

export async function geographyListChildren(input: GeographyListChildrenActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.geography.listChildren;
  return api.get<GeographyChildCollection>(path, options);
}
/** GET /v1/geography/places */
export type GeographyListPlacesActionInput = ActionInput<never, GeographyFeatureWindow, never>;

export async function geographyListPlaces(input: GeographyListPlacesActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.geography.listPlaces;
  return api.get<GeographyPlaceCollection>(path, options);
}
