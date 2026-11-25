import "server-only";
/** Loads the interface copy for the effective language: URL `lang`, then the language cookie, then English. */
import { connection } from "next/server";
import { cookies, headers } from "next/headers";
import { frontendGetCopyBundle } from "@mzizi/api-client/actions/frontend";
import { translate, type CopyBundle } from "#/lib/copy/translate";
import { languageCode, languageTag } from "#/lib/server/codes";

const LANGUAGE_COOKIE = "mzizi-app-lang";
/** The app whose interface keys are loaded (`product.apps`). */
const APP = "pro.app.web";
/** Interface wording changes with a release; it is cached for ten minutes per language. */
const copyCache = () => ({ caching: { revalidate: 600, tags: ["copy"] } });

/** URL `lang` wins, then the language cookie, then English. Used by every server read so names and wording agree. */
export async function effectiveLanguage(): Promise<string> {
  await connection();
  const fromUrl = (await headers()).get("x-mzizi-lang")?.trim();
  const fromCookie = (await cookies()).get(LANGUAGE_COOKIE)?.value;
  return fromUrl || fromCookie || "en";
}

async function bundle(language: string): Promise<CopyBundle> {
  const res = await frontendGetCopyBundle({ query: { app: APP, lang: languageCode(language) }, options: copyCache() });
  const body = res.body;
  if (!res.success || !body) return { language, hash: "", entries: {}, missing: [] };
  return { language: languageTag(body.language), hash: "", entries: Object.fromEntries(body.messages.map((m) => [m.key, m.text])), missing: [] };
}

export async function loadCopy(_country?: string): Promise<CopyBundle> {
  return bundle(await effectiveLanguage());
}

/** A translator for server components, for the language they are rendering in. Same keys and parameters as the client's `useCopy`. */
export async function getCopy(language: string) {
  return translate(await bundle(language));
}
