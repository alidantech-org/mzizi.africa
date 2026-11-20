import "server-only";
/** Loads the place catalogue for the URL's country from the generated API client. No frontend constants decide what exists. */
import { connection } from "next/server";
import { headers } from "next/headers";
import {
  explorerGetExplorerContext,
  explorerGetExplorerNavigation,
  explorerGetSetupBootstrap,
  explorerListExplorerChildren,
  explorerSearchExplorerPlaces,
} from "@mzizi/api-client/actions/explorer";
import type { ExplorerPlace } from "@mzizi/api-client";
import { effectiveLanguage } from "#/lib/server/copy";
import type { CatalogueEntry, PlaceCatalogue } from "#/lib/places/catalogue";

/** The country list and navigation availability are the same for every reader, so they are cached for an hour. */
const sharedCache = () => ({ caching: { revalidate: 3600, tags: ["countries"] } });

/** Places per page in the location list and search. */
const LIST_LIMIT = 25;

const slugName = (slug: string) =>
  decodeURIComponent(slug)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
/** Where a place sits, from its registered address: the places above it, nearest first, without the country. */
const parentsOf = (path: string, countryName: string) => {
  const above = path.split("/").filter(Boolean).slice(1, -1).reverse().map(slugName);
  return above.length ? above.join(", ") : countryName;
};

const entry = (p: ExplorerPlace, where: string): CatalogueEntry => ({
  kind: p.kind,
  name: p.name,
  where,
  href: p.canonicalPath,
});

export async function loadPlaceCatalogue(fallbackCountry?: string): Promise<PlaceCatalogue> {
  await connection(); // read per request: the API bridge tags requests with random ids, which cannot be prerendered
  const languageCode = await effectiveLanguage();
  const h = await headers();
  const path = h.get("x-mzizi-path") ?? "/";
  const find = (h.get("x-mzizi-find") ?? "").trim();
  const kind = (h.get("x-mzizi-lvl") ?? "").trim();
  const pageNo = Math.max(1, Number.parseInt(h.get("x-mzizi-pg") ?? "1", 10) || 1);
  const [pathCode, ...trail] = path.split("/").filter(Boolean);
  const code = pathCode;
  const gaps: string[] = [];

  const setup = await explorerGetSetupBootstrap({ query: { languageCode }, options: sharedCache() });
  const boot = setup.body;
  if (!setup.success || !boot) return { navigation: {}, languages: [], countries: [], entries: [], found: null, gaps: ["The country catalogue could not be loaded."] };

  const languages = boot.languages.map((l) => ({ code: l.code, name: l.name, nativeName: l.nativeName ?? null }));
  const served = boot.countries.filter((c) => c.served);
  const countries = boot.countries.map((c) => ({ code: c.code.toLowerCase(), iso: c.code, name: c.name, levels: [] as string[], levelDefs: [] as { code: string; label: string }[], served: c.served, flagUrl: c.flagUrl ?? null, flagColors: c.flagColors }));
  const entries: CatalogueEntry[] = boot.countries.map((c) => ({
    kind: "Country",
    name: c.name,
    where: "Country",
    href: `/${c.code.toLowerCase()}`,
  }));

  const current = served.find((c) => c.code.toLowerCase() === code?.toLowerCase());
  const searchCountry = current ?? served.find((c) => c.code.toLowerCase() === fallbackCountry?.toLowerCase());
  const navigation: Record<string, boolean> = {};
  if (searchCountry) {
    const nav = await explorerGetExplorerNavigation({ query: { countryCode: searchCountry.code }, options: sharedCache() });
    if (nav.success && nav.body) for (const item of nav.body.items) navigation[item.view] = item.available;
    else gaps.push("Which subjects have data could not be loaded.");
  }
  const nameById = new Map<string, string>();
  const search = async (): Promise<PlaceCatalogue["found"]> => {
    if ((find.length < 2 && !kind) || !searchCountry) return null;
    const res = await explorerSearchExplorerPlaces({
      query: {
        countryCode: searchCountry.code,
        query: find.length >= 2 ? find : undefined,
        kindCode: kind || undefined,
        page: pageNo,
        limit: LIST_LIMIT,
        languageCode,
      },
    });
    if (!res.success || !res.body) {
      gaps.push("Search could not be completed.");
      return null;
    }
    return {
      query: find.length >= 2 ? find : "",
      kind: kind || null,
      page: res.body.page,
      limit: res.body.limit,
      total: res.body.total,
      entries: res.body.places.map((p) => entry(p, (p.parentFeatureId && nameById.get(p.parentFeatureId)) || parentsOf(p.canonicalPath, searchCountry.name))),
    };
  };
  if (!current) return { navigation, languages, countries, entries, found: await search(), gaps: [...boot.gaps, ...gaps] };

  const ctxRes = await explorerGetExplorerContext({
    query: { countryCode: current.code, path: trail.join("/") || undefined, languageCode },
  });
  const ctx = ctxRes.body;
  if (!ctxRes.success || !ctx) {
    gaps.push(`${trail.join("/") || current.name} is not a registered place of ${current.name}.`);
    return { navigation, languages, countries, entries, found: await search(), gaps: [...boot.gaps, ...gaps] };
  }
  const own = countries.find((c) => c.iso === current.code)!;
  own.levelDefs = ctx.levels.filter((l) => l.depth > 0).map((l) => ({ code: l.kindCode, label: l.label }));
  own.levels = own.levelDefs.map((l) => l.label);

  // Children of the country root, of every ancestor and of the current place, so the list can drill down from here.
  // These reads and the search are independent, so they run together.
  const parents = [...ctx.chain, ...(ctx.chain.some((p) => p.featureId === ctx.place.featureId) ? [] : [ctx.place])];
  const seen = new Set<string>();
  for (const p of parents) nameById.set(p.featureId, p.name);
  const [foundList, ...childLists] = await Promise.all([
    search(),
    ...parents.map((parent) =>
      explorerListExplorerChildren({ query: { countryCode: current.code, featureId: parent.featureId, limit: 100, languageCode } }),
    ),
  ]);
  parents.forEach((parent, i) => {
    const res = childLists[i]!;
    const body = res.body;
    if (!res.success || !body) {
      gaps.push(`Places inside ${parent.name} could not be loaded.`);
      return;
    }
    const where = parent.depth === 0 ? current.name : parent.name;
    for (const p of body.places) {
      if (seen.has(p.featureId)) continue;
      seen.add(p.featureId);
      nameById.set(p.featureId, p.name);
      entries.push(entry(p, where));
    }
    if (body.total > body.places.length) gaps.push(`Only the first ${body.places.length} of ${body.total} places inside ${parent.name} are loaded.`);
  });
  return { navigation, languages, countries, entries, found: foundList, gaps: [...boot.gaps, ...gaps] };
}
