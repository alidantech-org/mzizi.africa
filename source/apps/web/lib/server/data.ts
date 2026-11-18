import "server-only";

import { cookies, headers } from "next/headers";

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
  return unwrap(
    getContext({
      query: {
        countryCode: jar.get("mz_country")?.value,
        languageCode: jar.get("mz_lang")?.value,
        path: address.replace(/^\/+|\/+$/g, "") || undefined,
        featureId,
      },
      options: edge ? { headers: { "cf-ipcountry": edge } } : undefined,
    }),
  );
}

/** The language the server renders in: the visitor's cookie, else the country's default, else English. */
export async function serverLanguage(): Promise<string> {
  const jar = await cookies();
  return jar.get("mz_lang")?.value ?? "en";
}
