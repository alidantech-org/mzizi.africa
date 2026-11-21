"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { ExplorerAddressesInput } from "#sdk/types/explorer/dto/addresses-input.ts";
import type { ExplorerAddresses } from "#sdk/types/explorer/dto/addresses.ts";
import type { ExplorerBootstrapInput } from "#sdk/types/explorer/dto/bootstrap-input.ts";
import type { ExplorerBootstrap } from "#sdk/types/explorer/dto/bootstrap.ts";
import type { ExplorerChildrenInput } from "#sdk/types/explorer/dto/children-input.ts";
import type { ExplorerContext } from "#sdk/types/explorer/dto/context.ts";
import type { ExplorerCoordinatesInput } from "#sdk/types/explorer/dto/coordinates-input.ts";
import type { ExplorerCopyBundle } from "#sdk/types/explorer/dto/copy-bundle.ts";
import type { ExplorerCopyInput } from "#sdk/types/explorer/dto/copy-input.ts";
import type { ExplorerLocationInput } from "#sdk/types/explorer/dto/location-input.ts";
import type { ExplorerLocation } from "#sdk/types/explorer/dto/location.ts";
import type { ExplorerNavigationInput } from "#sdk/types/explorer/dto/navigation-input.ts";
import type { ExplorerNavigation } from "#sdk/types/explorer/dto/navigation.ts";
import type { ExplorerOverview } from "#sdk/types/explorer/dto/overview.ts";
import type { ExplorerPlaceInput } from "#sdk/types/explorer/dto/place-input.ts";
import type { ExplorerPlaces } from "#sdk/types/explorer/dto/places.ts";
import type { ExplorerResolution } from "#sdk/types/explorer/dto/resolution.ts";
import type { ExplorerSearchInput } from "#sdk/types/explorer/dto/search-input.ts";
/** GET /v1/explorer/copy */
export type ExplorerGetCopyBundleActionInput = ActionInput<never, ExplorerCopyInput, never>;

export async function explorerGetCopyBundle(input: ExplorerGetCopyBundleActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.explorer.getCopyBundle;
  return api.get<ExplorerCopyBundle>(path, options);
}
/** GET /v1/explorer/context */
export type ExplorerGetExplorerContextActionInput = ActionInput<never, ExplorerPlaceInput, never>;

export async function explorerGetExplorerContext(input: ExplorerGetExplorerContextActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.explorer.getExplorerContext;
  return api.get<ExplorerContext>(path, options);
}
/** GET /v1/explorer/location */
export type ExplorerGetExplorerLocationActionInput = ActionInput<
  never,
  ExplorerLocationInput,
  never
>;

export async function explorerGetExplorerLocation(input: ExplorerGetExplorerLocationActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.explorer.getExplorerLocation;
  return api.get<ExplorerLocation>(path, options);
}
/** GET /v1/explorer/navigation */
export type ExplorerGetExplorerNavigationActionInput = ActionInput<
  never,
  ExplorerNavigationInput,
  never
>;

export async function explorerGetExplorerNavigation(
  input: ExplorerGetExplorerNavigationActionInput,
) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.explorer.getExplorerNavigation;
  return api.get<ExplorerNavigation>(path, options);
}
/** GET /v1/explorer/overview */
export type ExplorerGetExplorerOverviewActionInput = ActionInput<never, ExplorerPlaceInput, never>;

export async function explorerGetExplorerOverview(input: ExplorerGetExplorerOverviewActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.explorer.getExplorerOverview;
  return api.get<ExplorerOverview>(path, options);
}
/** GET /v1/explorer/setup */
export type ExplorerGetSetupBootstrapActionInput = ActionInput<
  never,
  ExplorerBootstrapInput,
  never
>;

export async function explorerGetSetupBootstrap(input: ExplorerGetSetupBootstrapActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.explorer.getSetupBootstrap;
  return api.get<ExplorerBootstrap>(path, options);
}
/** GET /v1/explorer/children */
export type ExplorerListExplorerChildrenActionInput = ActionInput<
  never,
  ExplorerChildrenInput,
  never
>;

export async function explorerListExplorerChildren(input: ExplorerListExplorerChildrenActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.explorer.listExplorerChildren;
  return api.get<ExplorerPlaces>(path, options);
}
/** POST /v1/explorer/addresses */
export type ExplorerResolveExplorerAddressesActionInput = ActionInput<
  never,
  never,
  ExplorerAddressesInput
>;

export async function explorerResolveExplorerAddresses(
  input: ExplorerResolveExplorerAddressesActionInput,
) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.explorer.resolveExplorerAddresses;
  return api.post<ExplorerAddresses>(path, input.body, options);
}
/** POST /v1/explorer/resolve */
export type ExplorerResolveExplorerCoordinatesActionInput = ActionInput<
  never,
  never,
  ExplorerCoordinatesInput
>;

export async function explorerResolveExplorerCoordinates(
  input: ExplorerResolveExplorerCoordinatesActionInput,
) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.explorer.resolveExplorerCoordinates;
  return api.post<ExplorerResolution>(path, input.body, options);
}
/** GET /v1/explorer/search */
export type ExplorerSearchExplorerPlacesActionInput = ActionInput<
  never,
  ExplorerSearchInput,
  never
>;

export async function explorerSearchExplorerPlaces(input: ExplorerSearchExplorerPlacesActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.explorer.searchExplorerPlaces;
  return api.get<ExplorerPlaces>(path, options);
}
