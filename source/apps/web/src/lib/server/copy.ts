import "server-only";
/** Loads the interface copy for the effective language: URL `lang`, then the language cookie, then the backend default. */
import { connection } from "next/server";
import { cookies, headers } from "next/headers";
import { explorerGetCopyBundle } from "@mzizi/api-client/actions/explorer";
import { translate, type CopyBundle } from "#/lib/copy/translate";

const LANGUAGE_COOKIE = "mzizi-app-lang";

/** URL `lang` wins, then the language cookie, then English. Used by every server read so names and wording agree. */
export async function effectiveLanguage(): Promise<string> {
  await connection();
  const fromUrl = (await headers()).get("x-mzizi-lang")?.trim();
  const fromCookie = (await cookies()).get(LANGUAGE_COOKIE)?.value;
  return fromUrl || fromCookie || "en";
}

export async function loadCopy(country?: string): Promise<CopyBundle> {
  const languageCode = await effectiveLanguage();
  const res = await explorerGetCopyBundle({
    query: { languageCode, countryCode: country?.toUpperCase(), area: undefined },
  });
  const body = res.body;
  if (!res.success || !body) return { language: languageCode, hash: "", entries: {}, missing: [] };
  return {
    language: body.language,
    hash: body.hash,
    entries: Object.fromEntries(body.entries.map((e) => [e.key, e.text])),
    missing: body.missing,
  };
}

/** A translator for server components, for the language they are rendering in. Same keys and parameters as the client's `useCopy`. */
export async function getCopy(language: string) {
  const res = await explorerGetCopyBundle({ query: { languageCode: language }, options: { caching: { revalidate: 600, tags: ["copy"] } } });
  const entries = Object.fromEntries((res.body?.entries ?? []).map((e) => [e.key, e.text]));
  return translate({ language, hash: res.body?.hash ?? "", entries, missing: res.body?.missing ?? [] });
}
