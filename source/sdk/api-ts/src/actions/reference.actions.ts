"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { ReferenceCountryCollection } from "#sdk/types/reference/dto/country-collection.ts";
import type { ReferenceCountryDetail } from "#sdk/types/reference/dto/country-detail.ts";
import type { ReferenceCountryScope } from "#sdk/types/reference/dto/country-scope.ts";
import type { ReferenceCurrencyCollection } from "#sdk/types/reference/dto/currency-collection.ts";
import type { ReferenceHierarchyCollection } from "#sdk/types/reference/dto/hierarchy-collection.ts";
import type { ReferenceLanguageCollection } from "#sdk/types/reference/dto/language-collection.ts";
import type { ReferenceReferenceWindow } from "#sdk/types/reference/dto/reference-window.ts";
import type { ReferenceUnitCollection } from "#sdk/types/reference/dto/unit-collection.ts";
/** GET /v1/reference/countries/{code} */
export type ReferenceGetCountryActionInput = ActionInput<{ code: string }, never, never>;

export async function referenceGetCountry(input: ReferenceGetCountryActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.reference.getCountry(input.params);
  return api.get<ReferenceCountryDetail>(path, options);
}
/** GET /v1/reference/countries */
export type ReferenceListCountriesActionInput = ActionInput<never, ReferenceReferenceWindow, never>;

export async function referenceListCountries(input: ReferenceListCountriesActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.reference.listCountries;
  return api.get<ReferenceCountryCollection>(path, options);
}
/** GET /v1/reference/currencies */
export type ReferenceListCurrenciesActionInput = ActionInput<
  never,
  ReferenceReferenceWindow,
  never
>;

export async function referenceListCurrencies(input: ReferenceListCurrenciesActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.reference.listCurrencies;
  return api.get<ReferenceCurrencyCollection>(path, options);
}
/** GET /v1/reference/hierarchies */
export type ReferenceListHierarchiesActionInput = ActionInput<never, ReferenceCountryScope, never>;

export async function referenceListHierarchies(input: ReferenceListHierarchiesActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.reference.listHierarchies;
  return api.get<ReferenceHierarchyCollection>(path, options);
}
/** GET /v1/reference/languages */
export type ReferenceListLanguagesActionInput = ActionInput<never, ReferenceReferenceWindow, never>;

export async function referenceListLanguages(input: ReferenceListLanguagesActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.reference.listLanguages;
  return api.get<ReferenceLanguageCollection>(path, options);
}
/** GET /v1/reference/units */
export type ReferenceListUnitsActionInput = ActionInput<never, ReferenceReferenceWindow, never>;

export async function referenceListUnits(input: ReferenceListUnitsActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.reference.listUnits;
  return api.get<ReferenceUnitCollection>(path, options);
}
