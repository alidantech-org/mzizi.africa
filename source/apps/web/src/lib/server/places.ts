import "server-only";
/**
 * Loads the place catalogue for the shell from the generated API client: countries and languages (home screen), the
 * place in the URL with its breadcrumb and divisions (place screen) and, when the reader searches, the search screen.
 * Every name comes back from the backend in the reader's language; nothing here derives a name from an address.
 */
import { connection } from "next/server";
import { headers } from "next/headers";
import { frontendGetHomeScreen, frontendGetPlaceScreen, frontendSearchScreen } from "@mzizi/api-client/actions/frontend";
import { effectiveLanguage } from "#/lib/server/copy";
import { countryCode, countryOf, hrefOf, languageCode, languageTag, placeCode } from "#/lib/server/codes";
import type { CatalogueEntry, PlaceCatalogue } from "#/lib/places/catalogue";

/** The country list is the same for every reader of a language; cached for an hour. */
const sharedCache = () => ({ caching: { revalidate: 3600, tags: ["countries"] } });
/** Places change only when data is loaded; each answer is kept for ten minutes, keyed by its query. */
const placeCache = () => ({ caching: { revalidate: 600, tags: ["places"] } });

export async function loadPlaceCatalogue(fallbackCountry?: string, _addresses: readonly string[] = []): Promise<PlaceCatalogue> {
  await connection();
  const language = await effectiveLanguage();
  const lang = languageCode(language);
  const h = await headers();
  const path = h.get("x-mzizi-path") ?? "/";
  const find = (h.get("x-mzizi-find") ?? "").trim();
  const [code, ...trail] = path.split("/").filter(Boolean);
  const gaps: string[] = [];

  const home = await frontendGetHomeScreen({ query: { lang }, options: sharedCache() });
  if (!home.success || !home.body)
    return { searchable: false, navigation: {}, languages: [], countries: [], entries: [], resolved: {}, found: null, gaps: ["The country catalogue could not be loaded."] };

  const languages = home.body.languages.map((l) => ({ code: languageTag(l.code), name: l.name.text, nativeName: null }));
  const countries = home.body.countries.map((c) => ({
    code: countryOf(c.code),
    iso: (c.isoAlpha2 ?? countryOf(c.code)).toUpperCase(),
    name: c.name.text,
    levels: [] as string[],
    levelDefs: [] as { code: string; label: string }[],
    served: false,
    flagUrl: null,
    flagColors: [],
  }));
  const country = (code ?? fallbackCountry ?? "").toLowerCase();
  const entries: CatalogueEntry[] = [];
  const resolved: PlaceCatalogue["resolved"] = {};
  const navigation: Record<string, boolean> = {};
  let found: PlaceCatalogue["found"] = null;

  if (country && countries.some((c) => c.code === country)) {
    const [screen, search] = await Promise.all([
      frontendGetPlaceScreen({
        query: { country: countryCode(country), place: code && trail.length ? placeCode({ country, trail }) : undefined, lang },
        options: placeCache(),
      }),
      find.length >= 2 ? frontendSearchScreen({ query: { country: countryCode(country), text: find, lang }, options: placeCache() }) : Promise.resolve(null),
    ]);
    const own = countries.find((c) => c.code === country);
    if (screen.success && screen.body) {
      if (own) own.served = true;
      const body = screen.body;
      for (const child of body.children) entries.push({ kind: child.kind?.text ?? "", kindCode: "", name: child.name.text, where: body.place.name.text, href: hrefOf(child.code) });
      const chain = [...body.breadcrumb, body.place];
      chain.forEach((p, i) => {
        resolved[hrefOf(p.code)] = { name: p.name.text, kind: p.kind?.text ?? "", parent: i > 0 ? (chain[i - 1]?.name.text ?? null) : null };
      });
      Object.assign(navigation, {
        overview: true,
        statistics: body.figures.length > 0,
        leaders: body.leaders.length > 0,
        institutions: true,
        finance: body.projects.length > 0,
      });
    } else {
      gaps.push(`${trail.join("/") || country.toUpperCase()} is not a registered place.`);
    }
    if (search?.success && search.body)
      found = {
        query: find,
        kind: null,
        page: 1,
        limit: search.body.hits.length,
        total: search.body.hits.length,
        entries: search.body.hits.map((hit) => ({ kind: hit.kind, kindCode: "", name: hit.name.text, where: hit.context?.text ?? "", href: hrefOf(hit.code) })),
      };
  }
  return { searchable: Boolean(country), navigation, languages, countries, entries, resolved, found, gaps };
}
