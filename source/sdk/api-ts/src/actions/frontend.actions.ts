"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { FrontendCopyBundle } from "#sdk/types/frontend/dto/copy-bundle.ts";
import type { FrontendCopyRequest } from "#sdk/types/frontend/dto/copy-request.ts";
import type { FrontendHomeRequest } from "#sdk/types/frontend/dto/home-request.ts";
import type { FrontendHomeScreen } from "#sdk/types/frontend/dto/home-screen.ts";
import type { FrontendInstitutionRequest } from "#sdk/types/frontend/dto/institution-request.ts";
import type { FrontendInstitutionScreen } from "#sdk/types/frontend/dto/institution-screen.ts";
import type { FrontendPlaceRequest } from "#sdk/types/frontend/dto/place-request.ts";
import type { FrontendPlaceScreen } from "#sdk/types/frontend/dto/place-screen.ts";
import type { FrontendRankingRequest } from "#sdk/types/frontend/dto/ranking-request.ts";
import type { FrontendRankingScreen } from "#sdk/types/frontend/dto/ranking-screen.ts";
import type { FrontendSearchRequest } from "#sdk/types/frontend/dto/search-request.ts";
import type { FrontendSearchResults } from "#sdk/types/frontend/dto/search-results.ts";
/** GET /v1/frontend/copy */
export type FrontendGetCopyBundleActionInput = ActionInput<never, FrontendCopyRequest, never>;

export async function frontendGetCopyBundle(input: FrontendGetCopyBundleActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.frontend.getCopyBundle;
  return api.get<FrontendCopyBundle>(path, options);
}
/** GET /v1/frontend/home */
export type FrontendGetHomeScreenActionInput = ActionInput<never, FrontendHomeRequest, never>;

export async function frontendGetHomeScreen(input: FrontendGetHomeScreenActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.frontend.getHomeScreen;
  return api.get<FrontendHomeScreen>(path, options);
}
/** GET /v1/frontend/institution */
export type FrontendGetInstitutionScreenActionInput = ActionInput<
  never,
  FrontendInstitutionRequest,
  never
>;

export async function frontendGetInstitutionScreen(input: FrontendGetInstitutionScreenActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.frontend.getInstitutionScreen;
  return api.get<FrontendInstitutionScreen>(path, options);
}
/** GET /v1/frontend/place */
export type FrontendGetPlaceScreenActionInput = ActionInput<never, FrontendPlaceRequest, never>;

export async function frontendGetPlaceScreen(input: FrontendGetPlaceScreenActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.frontend.getPlaceScreen;
  return api.get<FrontendPlaceScreen>(path, options);
}
/** GET /v1/frontend/ranking */
export type FrontendGetRankingScreenActionInput = ActionInput<never, FrontendRankingRequest, never>;

export async function frontendGetRankingScreen(input: FrontendGetRankingScreenActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.frontend.getRankingScreen;
  return api.get<FrontendRankingScreen>(path, options);
}
/** GET /v1/frontend/search */
export type FrontendSearchScreenActionInput = ActionInput<never, FrontendSearchRequest, never>;

export async function frontendSearchScreen(input: FrontendSearchScreenActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.frontend.searchScreen;
  return api.get<FrontendSearchResults>(path, options);
}
