/** Context: the country and how it was decided, the language, the place resolved from the clean address path, and the ladder. */
import type { DataSource } from "typeorm";

import { crumbs, featureName, lastWord, shortCode, valueLabel } from "#/modules/insights/features/insights/reads/shared.ts";

export interface PlaceRef {
  featureId: string;
  name: string;
  kindCode: string;
  kindLabel: string;
  path: string;
}

/** The CDN sends `XX` for an unknown country and `T1` for Tor; neither names a country. */
const NO_COUNTRY = new Set(["XX", "T1", ""]);

interface CountryRow {
  id: string;
  code: string;
  iso: string | null;
  name: string;
  currency: string | null;
  language: string | null;
  subdomain: string | null;
  served: boolean;
}

const COUNTRY = `select c.id, c.code, c.iso_alpha2 as iso, c.name, cur.code as currency, l.iso6391 as language, c.subdomain, c.is_served as served
  from reference.countries c left join reference.values cur on cur.id = c.currency_id left join reference.languages l on l.id = c.default_language_id`;

/** The clean address path of a place: its slug and its parents' slugs, widest first. */
export async function slugPath(db: DataSource, featureId: string): Promise<string | null> {
  const rows: { path: string | null }[] = await db.query(
    `with recursive up as (
       select id, slug, parent_slug_id, 1 as depth from source.slugs
        where subject_table = 'geography.features' and subject_id = $1 and to_year is null
       union all
       select s.id, s.slug, s.parent_slug_id, up.depth + 1 from source.slugs s join up on s.id = up.parent_slug_id where up.depth < 8)
     select string_agg(slug, '/' order by depth desc) as path from up`,
    [featureId],
  );
  return rows[0]?.path ?? null;
}

export async function placeRefs(db: DataSource, featureId: string, lang: string): Promise<PlaceRef[]> {
  const chain = await crumbs(db, featureId, lang);
  const out: PlaceRef[] = [];
  for (const unit of chain) {
    const path = await slugPath(db, unit.featureId);
    if (path !== null) out.push({ ...unit, kindCode: lastWord(unit.kindCode), path });
  }
  return out;
}

async function resolvePlace(db: DataSource, countryId: string, segments: string[]) {
  let parent: string | null = null;
  let featureId: string | null = null;
  let used = 0;
  for (const segment of segments) {
    const rows: { id: string; subject_id: string }[] = await db.query(
      `select sl.id, sl.subject_id from source.slugs sl join reference.values ns on ns.id = sl.namespace_id and ns.code = 'ref.val.src.slug.namespace.place'
        where sl.country_id = $1 and sl.parent_slug_id is not distinct from $2::uuid and sl.slug = $3 and sl.to_year is null and sl.deleted_at is null limit 1`,
      [countryId, parent, segment],
    );
    if (rows.length === 0) break;
    parent = rows[0]!.id;
    featureId = rows[0]!.subject_id;
    used += 1;
  }
  return { featureId, rest: segments.slice(used) };
}

export async function context(
  db: DataSource,
  input: { countryCode?: string; languageCode?: string; path?: string; featureId?: string; edgeCountry?: string },
) {
  const gaps: string[] = [];
  let country: CountryRow | undefined;
  let source = "default";
  const pick = async (where: string, value: string) =>
    (await db.query(`${COUNTRY} where ${where} limit 1`, [value]) as CountryRow[])[0];
  if (input.countryCode) {
    country = await pick("(lower(c.code) = lower($1) or right(lower(c.code), length($1) + 1) = '.' || lower($1)) or lower(c.iso_alpha2) = lower($1)", input.countryCode);
    source = "selection";
  }
  const edge = (input.edgeCountry ?? "").toUpperCase();
  if (!country && process.env.TRUST_EDGE_COUNTRY === "true" && !NO_COUNTRY.has(edge)) {
    country = await pick("c.iso_alpha2 = $1", edge);
    source = "cdn_header";
    if (!country) gaps.push("The country detected from your connection has no data here yet; choose a country.");
  }
  const override = process.env.NODE_ENV === "production" ? "" : (process.env.DEV_EDGE_COUNTRY ?? "").toUpperCase();
  if (!country && override && !NO_COUNTRY.has(override)) {
    country = await pick("c.iso_alpha2 = $1", override);
    source = "development_override";
  }
  if (!country) {
    country = (await db.query(`${COUNTRY} where c.is_served order by c.code limit 1`) as CountryRow[])[0];
    source = "default";
  }
  if (!country) {
    country = (await db.query(`${COUNTRY} order by c.code limit 1`) as CountryRow[])[0]!;
    gaps.push("No country is served yet.");
  }
  const languageCode = input.languageCode ?? country.language ?? "en";
  const served: { code: string; name: string; served: boolean }[] = await db.query(
    "select c.code, c.name, c.is_served as served from reference.countries c where c.is_served or c.id = $1 order by c.name",
    [country.id],
  );
  const segments = (input.path ?? "").split("/").map((s) => s.trim()).filter(Boolean);
  const resolved = input.featureId ? { featureId: input.featureId, rest: [] as string[] } : await resolvePlace(db, country.id, segments);
  const { featureId, rest } = resolved;
  const chain = featureId ? await placeRefs(db, featureId, languageCode) : [];
  const levels: { depth: number; kind_code: string; kind_label: string; routing: boolean }[] = await db.query(
    `select l.depth, k.code as kind_code, ${valueLabel("k.id", "$2")} as kind_label, l.is_routing_hierarchy as routing
       from geography.levels l join reference.values k on k.id = l.feature_kind_id
      where l.country_id = $1 and l.is_routing_hierarchy order by l.depth`,
    [country.id, languageCode],
  );
  if ((segments.length > 0 || input.featureId) && !featureId) gaps.push("That place is not in the registry for this country.");
  if (!country.served) gaps.push("This country is not served yet; its data is being prepared.");
  return {
    country: {
      code: shortCode(country.code), isoCode: country.iso, name: country.name, currencyCode: country.currency ? lastWord(country.currency) : null,
      defaultLanguageCode: country.language, subdomain: country.subdomain, isServed: country.served,
    },
    countrySource: source,
    countries: served.map((c) => ({ code: shortCode(c.code), name: c.name, isServed: c.served })),
    languageCode,
    place: chain.length > 0 ? chain[chain.length - 1]! : null,
    chain,
    rest,
    levels: levels.map((l) => ({ depth: l.depth, kindCode: lastWord(l.kind_code), kindLabel: l.kind_label, isRouting: l.routing })),
    gaps,
  };
}

export { featureName };
