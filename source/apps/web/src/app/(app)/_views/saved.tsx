/** Saved places. Names are resolved on the server, in the reader's language, from the places saved in the cookie. */
import { cookies } from "next/headers";
import { connection } from "next/server";
import { explorerGetExplorerContext } from "@mzizi/api-client/actions/explorer";
import { SavedPlaces, type ResolvedPlace } from "#/components/places/saved-places";
import { SavedHeader } from "#/app/(app)/_views/saved-header";
import { demoSegments } from "#/lib/navigation/base";
import { COOKIES, decodeSaved } from "#/lib/preferences/pref-cookies";
import { effectiveLanguage } from "#/lib/server/copy";

export default async function SavedView() {
  await connection();
  const raw = (await cookies()).get(COOKIES.saved)?.value;
  let text = "";
  try {
    text = raw ? decodeURIComponent(raw) : "";
  } catch {
    text = raw ?? "";
  }
  const saved = decodeSaved(text);
  const languageCode = await effectiveLanguage();
  const entries = await Promise.all(
    saved.map(async (s): Promise<[string, ResolvedPlace | null]> => {
      const [country, ...trail] = demoSegments(s.path);
      if (!country) return [s.path, null];
      const res = await explorerGetExplorerContext({
        query: { countryCode: country.toUpperCase(), path: trail.join("/") || undefined, languageCode },
      });
      const body = res.body;
      if (!res.success || !body) return [s.path, null];
      // The places above this one, nearest first, then the country.
      const above = body.chain.filter((p) => p.depth > 0 && p.featureId !== body.place.featureId).map((p) => p.name).reverse();
      const parents = body.place.depth === 0 ? [] : [...above, body.country.name];
      return [s.path, { name: body.place.name, kind: body.place.depth === 0 ? "" : body.place.kind, parents: parents.slice(0, 2) }];
    }),
  );
  return (
    <>
      <SavedHeader />
      <SavedPlaces manage resolved={Object.fromEntries(entries)} />
    </>
  );
}
