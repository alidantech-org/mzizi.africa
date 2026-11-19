import "server-only";

import { cookies, headers } from "next/headers";

import { getCopy } from "@mzizi/api-client/actions/experience/get-copy.actions.ts";
import { getContext } from "@mzizi/api-client/actions/experience/get-context.actions.ts";
import type { ExperienceContext } from "@mzizi/api-client/types/experience/context.ts";

/** The body of a generated server action, or null when the API said no: pages then show the gap instead of failing. */
export async function unwrap<T>(pending: Promise<{ success: boolean; body: T | null }>): Promise<T | null> {
  try {
    const response = await pending;
    return response.success ? response.body : null;
  } catch {
    return null;
  }
}

/** The visitor's context for one request: country, language, and the place the address resolves to. */
export async function loadContext(path?: string, featureId?: string): Promise<ExperienceContext | null> {
  const [jar, h] = await Promise.all([cookies(), headers()]);
  const address = path ?? h.get("x-path") ?? "/";
  const edge = h.get("cf-ipcountry") ?? undefined;
  const parts = address.split("/").filter(Boolean);
  const explicitCountry = parts.length > 0 && parts[0]!.length === 2 && parts[0] !== "me" ? parts.shift() : undefined;
  return unwrap(
    getContext({
      query: {
        countryCode: explicitCountry ?? jar.get("mz_country")?.value,
        languageCode: h.get("x-language") ?? jar.get("mz_lang")?.value,
        path: parts.join("/") || undefined,
        featureId,
      },
      options: edge ? { headers: { "cf-ipcountry": edge } } : undefined,
    }),
  );
}

/** The language the server renders in: the visitor's cookie, else the country's default, else English. */
export async function serverLanguage(): Promise<string> {
  const jar = await cookies();
  const requestHeaders = await headers();
  return requestHeaders.get("x-language") ?? jar.get("mz_lang")?.value ?? "en";
}

/** The interface wording for a language, as one key-to-text map; empty when the API is unreachable (screens then show English). */
export async function loadCopy(languageCode: string, countryCode?: string): Promise<Record<string, string>> {
  const catalog = await unwrap(getCopy({ query: { languageCode, countryCode } }));
  return Object.fromEntries((catalog?.entries ?? []).map((entry) => [entry.key, entry.text]));
}
