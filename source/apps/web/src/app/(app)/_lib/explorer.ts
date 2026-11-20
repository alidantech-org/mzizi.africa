import "server-only";
import { connection } from "next/server";
import { cookies } from "next/headers";
import {
  getSetupBootstrap,
  getExplorerContext,
  getExplorerOverview,
  searchExplorerPlaces,
  listExplorerChildren,
} from "@mzizi/api-client/actions/explorer.actions.ts";

export type Query = { [key: string]: string | string[] | undefined };
export function value(query: Query, key: string): string | undefined {
  const entry = query[key];
  if (Array.isArray(entry)) throw new Error(`Repeated parameter: ${key}`);
  return entry;
}
export async function preferences(query: Query) {
  const jar = await cookies();
  return {
    language: value(query, "lang") ?? jar.get("mzizi-language")?.value ?? "en",
    explicitLanguage: value(query, "lang"),
    savedPath: jar.get("mzizi-place")?.value,
    theme: jar.get("mzizi-theme")?.value ?? "system",
    completed: jar.get("mzizi-setup")?.value === "complete",
  };
}
export function href(path: string, lang?: string) {
  return lang ? `${path}?lang=${encodeURIComponent(lang)}` : path;
}
export async function bootstrap(language: string) {
  await connection();
  const response = await getSetupBootstrap({ options: { cache: "no-store" }, query: { languageCode: language } });
  if (!response.success || !response.body)
    throw new Error(response.message || "The country and language catalogue is unavailable.");
  return response.body;
}
export async function resolveContext(country: string, path: string, language: string, featureId?: string) {
  await connection();
  const response = await getExplorerContext({
    options: { cache: "no-store" },
    query: { countryCode: country.toUpperCase(), ...(featureId ? { featureId } : path ? { path } : {}), languageCode: language },
  });
  return response;
}
export async function loadOverview(country: string, path: string, language: string) {
  await connection();
  return getExplorerOverview({
    options: { cache: "no-store" },
    query: { countryCode: country.toUpperCase(), ...(path ? { path } : {}), languageCode: language },
  });
}
export async function selectPlaces(country: string, language: string, query?: string, featureId?: string) {
  await connection();
  if (query && query.trim().length >= 2)
    return searchExplorerPlaces({
      options: { cache: "no-store" },
      query: { countryCode: country.toUpperCase(), languageCode: language, query: query.trim(), limit: 20 },
    });
  return listExplorerChildren({
    options: { cache: "no-store" },
    query: { countryCode: country.toUpperCase(), languageCode: language, featureId, limit: 20 },
  });
}
