import "server-only";
/**
 * Loads the place catalogue for the page from the generated API client: the country list, which subjects have data, and
 * one location read for the address in the URL. The address goes to the backend as the readable slugs of the URL; the
 * backend resolves it and returns names, parents and kinds, so nothing here derives a name from a slug.
 */
import { connection } from "next/server";
import { headers } from "next/headers";
import {
  explorerGetExplorerLocation,
  explorerGetExplorerNavigation,
  explorerGetSetupBootstrap,
  explorerResolveExplorerAddresses,
} from "@mzizi/api-client/actions/explorer";
import type { ExplorerPlace } from "@mzizi/api-client";
import { effectiveLanguage } from "#/lib/server/copy";
import type { CatalogueEntry, PlaceCatalogue } from "#/lib/places/catalogue";

/** The country list and navigation availability are the same for every reader, so they are cached for an hour. */
const sharedCache = () => ({ caching: { revalidate: 3600, tags: ["countries"] } });
/** Places are public and change only when data is loaded; each answer is kept for ten minutes, keyed by its query. */
const placeCache = () => ({ caching: { revalidate: 600, tags: ["places"] } });

/** Places per page in the location list and search. */
const LIST_LIMIT = 25;

const entry = (p: ExplorerPlace, fallbackWhere: string): CatalogueEntry => ({
  kind: p.kind,
  kindCode: p.kindCode,
  name: p.name,
  where: p.parentName ?? fallbackWhere,
  href: p.canonicalPath,
});

/** `addresses` are saved or home places as they appear in URLs; their names come back from the backend in the reader's language. */
export async function loadPlaceCatalogue(fallbackCountry?: string, addresses: readonly string[] = []): Promise<PlaceCatalogue> {
  await connection(); // read per request: the API bridge tags requests with random ids, which cannot be prerendered
  const languageCode = await effectiveLanguage();
  const h = await headers();
  const path = h.get("x-mzizi-path") ?? "/";
  const find = (h.get("x-mzizi-find") ?? "").trim();
  const kind = (h.get("x-mzizi-lvl") ?? "").trim();
  const pageNo = Math.max(1, Number.parseInt(h.get("x-mzizi-pg") ?? "1", 10) || 1);
  const [code, ...trail] = path.split("/").filter(Boolean);
  const gaps: string[] = [];
  const empty = (extra: string): PlaceCatalogue => ({
    searchable: false,
    navigation: {},
    languages: [],
    countries: [],
    entries: [],
    resolved: {},
    found: null,
    gaps: [extra],
  });

  const setup = await explorerGetSetupBootstrap({ query: { languageCode }, options: sharedCache() });
  const boot = setup.body;
  if (!setup.success || !boot) return empty("The country catalogue could not be loaded.");

  const languages = boot.languages.map((l) => ({ code: l.code, name: l.name, nativeName: l.nativeName ?? null }));
  const countries = boot.countries.map((c) => ({
    code: c.code.toLowerCase(),
    iso: c.code,
    name: c.name,
    levels: [] as string[],
    levelDefs: [] as { code: string; label: string }[],
    served: c.served,
    flagUrl: c.flagUrl ?? null,
    flagColors: c.flagColors,
  }));
  const entries: CatalogueEntry[] = boot.countries.map((c) => ({
    kind: "",
    kindCode: "ref.val.geo.feature.kind.country",
    name: c.name,
    where: "",
    href: `/${c.code.toLowerCase()}`,
  }));

  const served = boot.countries.filter((c) => c.served);
  const current = served.find((c) => c.code.toLowerCase() === code?.toLowerCase());
  const searchCountry = current ?? served.find((c) => c.code.toLowerCase() === fallbackCountry?.toLowerCase());
  const navigation: Record<string, boolean> = {};
  const resolved: PlaceCatalogue["resolved"] = {};
  let found: PlaceCatalogue["found"] = null;

  // These reads are independent, so they run together.
  const [nav, loc, names] = await Promise.all([
    searchCountry
      ? explorerGetExplorerNavigation({ query: { countryCode: searchCountry.code }, options: sharedCache() })
      : Promise.resolve(null),
    searchCountry
      ? explorerGetExplorerLocation({
          query: {
            countryCode: searchCountry.code,
            // The readable address exactly as in the URL; the backend resolves it.
            path: current && trail.length ? trail.join("/") : undefined,
            languageCode,
            find: find.length >= 2 ? find : undefined,
            kindCode: kind || undefined,
            page: pageNo,
            limit: LIST_LIMIT,
          },
          options: placeCache(),
        })
      : Promise.resolve(null),
    addresses.length
      ? explorerResolveExplorerAddresses({ body: { addresses: [...addresses], languageCode } }) // a POST: the backend keeps the registry, so no bridge cache
      : Promise.resolve(null),
  ]);

  if (nav) {
    if (nav.success && nav.body) for (const item of nav.body.items) navigation[item.view] = item.available;
    else gaps.push("Which subjects have data could not be loaded.");
  }
  if (names?.success && names.body)
    for (const a of names.body.places)
      if (a.place) resolved[a.address] = { name: a.place.name, kind: a.place.kind, parent: a.place.parentName ?? null };

  if (searchCountry && loc) {
    const body = loc.body;
    if (!loc.success || !body) {
      gaps.push(`${trail.join("/") || searchCountry.name} is not a registered place of ${searchCountry.name}.`);
    } else {
      const own = countries.find((c) => c.iso === searchCountry.code)!;
      own.levelDefs = body.context.levels.filter((l) => l.depth > 0).map((l) => ({ code: l.kindCode, label: l.label }));
      own.levels = own.levelDefs.map((l) => l.label);
      const seen = new Set<string>();
      for (const group of body.groups) {
        for (const p of group.children) {
          if (seen.has(p.featureId)) continue;
          seen.add(p.featureId);
          entries.push(entry(p, group.place.name));
        }
        if (group.total > group.children.length)
          gaps.push(`Only the first ${group.children.length} of ${group.total} places inside ${group.place.name} are loaded.`);
      }
      for (const p of body.context.chain) resolved[p.canonicalPath] = { name: p.name, kind: p.kind, parent: p.parentName ?? null };
      if (body.found)
        found = {
          query: find.length >= 2 ? find : "",
          kind: kind || null,
          page: body.found.page,
          limit: body.found.limit,
          total: body.found.total,
          entries: body.found.places.map((p) => entry(p, searchCountry.name)),
        };
    }
  }
  return { searchable: Boolean(searchCountry), navigation, languages, countries, entries, resolved, found, gaps: [...boot.gaps, ...gaps] };
}
