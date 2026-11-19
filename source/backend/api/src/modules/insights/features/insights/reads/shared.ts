/**
 * Pieces every insight read uses: crumbs for the chain of units above a place, media with embed addresses, the
 * descendants of a unit, and the standard "what is missing" wording. Written by hand; Dryv scaffolds only the use cases.
 */
import type { DataSource } from "typeorm";

import { chainOf } from "#/modules/locality/features/places/reads/places.ts";
import { entityName, featureName, valueLabel } from "#/modules/locality/features/places/reads/language.ts";

export { entityName, featureName, valueLabel };

export interface Crumb {
  featureId: string;
  name: string;
  kindCode: string;
  kindLabel: string;
}

/** Where stored media bytes are served from (the engine serves the registered files in development). */
export const MEDIA_BASE = process.env.MEDIA_BASE_URL ?? "http://127.0.0.1:8800/media";

export const LANG = "en";

/** The units above a place, widest first, ending with the place itself. */
export async function crumbs(db: DataSource, featureId: string, lang = LANG): Promise<Crumb[]> {
  const chain = await chainOf(db, featureId, lang);
  return chain.map((unit) => ({
    featureId: unit.featureId,
    name: unit.name,
    kindCode: unit.kindCode,
    kindLabel: unit.kindLabel,
  }));
}

/** Short kind word of a stored value code: `ref.val.geo.feature.kind.county` becomes `county`. */
export const lastWord = (code: string): string => code.replace(/^.*\./, "");

export interface MediaItem {
  kind: string;
  title: string | null;
  url: string;
  thumbnailUrl: string | null;
  platform: string | null;
  embedUrl: string | null;
  mimeType: string | null;
  stored: boolean;
}

/** The address a browser can embed for a remote post or video, when the platform allows it and the URL names one. */
export function embedFor(platform: string | null, url: string): string | null {
  try {
    const u = new URL(url);
    if (platform === "youtube") {
      const id =
        u.searchParams.get("v") ?? (u.hostname === "youtu.be" ? u.pathname.slice(1) : null);
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (platform === "vimeo") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
    }
    if (platform === "tiktok") {
      const id = /\/video\/(\d+)/.exec(u.pathname)?.[1];
      return id ? `https://www.tiktok.com/embed/v2/${id}` : null;
    }
    if (platform === "facebook") {
      return `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(url)}&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true`;
    }
    if (platform === "instagram") {
      const code = /\/(p|reel)\/([\w-]+)/.exec(u.pathname);
      return code ? `https://www.instagram.com/${code[1]}/${code[2]}/embed` : null;
    }
    if (platform === "x") {
      const id = /\/status\/(\d+)/.exec(u.pathname)?.[1];
      return id ? `https://platform.twitter.com/embed/Tweet.html?id=${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

interface MediaRow {
  subject_id: string;
  kind: string;
  title: string | null;
  external_url: string | null;
  thumbnail_url: string | null;
  platform: string | null;
  s3_key: string | null;
  content_type: string | null;
}

/** Media of subject records, in display order. Stored files get a served address; remote ones keep their raw URL. */
export async function mediaFor(
  db: DataSource,
  subjectTable: string,
  ids: readonly string[],
  perSubject = 6,
): Promise<Map<string, MediaItem[]>> {
  const found = new Map<string, MediaItem[]>();
  if (ids.length === 0) return found;
  const rows: MediaRow[] = await db.query(
    `select m.subject_id, k.code as kind, m.title, m.external_url, m.thumbnail_url, pf.code as platform, fv.s3_key, fv.content_type
     from filesystem.media m
     join reference.values k on k.id = m.kind_id
     left join reference.values pf on pf.id = m.platform_id
     left join filesystem.file_versions fv on fv.id = m.file_version_id
     where m.subject_table = $1 and m.subject_id = any($2::uuid[]) and m.deleted_at is null
     order by m.subject_id, m.position nulls last, m.code`,
    [subjectTable, ids],
  );
  for (const row of rows) {
    const platform = row.platform === null ? null : lastWord(row.platform);
    const stored = row.s3_key !== null;
    const url = stored ? `${MEDIA_BASE}/${row.s3_key!.replace(/^media\//, "")}` : row.external_url!;
    const list = found.get(row.subject_id) ?? [];
    if (list.length >= perSubject) continue;
    list.push({
      kind: lastWord(row.kind),
      title: row.title,
      url,
      thumbnailUrl: row.thumbnail_url,
      platform,
      embedUrl: stored || row.external_url === null ? null : embedFor(platform, row.external_url),
      mimeType: row.content_type,
      stored,
    });
    found.set(row.subject_id, list);
  }
  return found;
}

/** Ids of the feature and every unit below it (parts of parts), for roll-ups. */
export async function descendantIds(db: DataSource, featureId: string): Promise<string[]> {
  const rows: { id: string }[] = await db.query(
    `with recursive down as (
       select $1::uuid as id, 0 as depth
       union
       select r.subject_feature_id, d.depth + 1 from geography.relationships r join down d on r.object_feature_id = d.id
       where d.depth < 6 and r.to_year is null)
     select distinct id from down`,
    [featureId],
  );
  return rows.map((row) => row.id);
}

/** A latest-value sub-query for a baseline (no breakdown) observation of an indicator at a feature. */
export const latestBaseline = (indicatorCode: string, featureExpr: string): string => `(
  select o.value from statistics.observations o join statistics.indicators i on i.id = o.indicator_id
  where ${indicatorCode.startsWith("ref.val.") ? hasRole("i", indicatorCode) : `i.code = '${indicatorCode}'`} and o.feature_id = ${featureExpr}
    and o.sex_id is null and o.age_group_id is null and o.residence_id is null and o.ethnicity_id is null and o.language_id is null
  order by o.period_from desc limit 1)`;

/**
 * Roles an indicator plays (reference scheme `sta.indicator.role`). The reads ask for a role and never name an indicator,
 * so the figures a screen needs are found through the data, whatever the indicator is called in a country.
 */
const role = (name: string): string => `ref.val.sta.indicator.role.${name}`;
export const POPULATION = role("population");
export const AREA = role("area");
export const REGISTERED_VOTERS = role("registered-voters");
export const FACILITY_CAPACITY = role("facility-capacity");
/** The derived density has no row of its own; clients pass this code back to read it. */
export const DENSITY = "derived.density";
/** SQL: the indicator aliased `alias` plays the role bound as parameter `$n`. */
export const hasRoleParam = (alias: string, n: number): string =>
  `${alias}.role_id = (select r.id from reference.values r where r.code = $${n})`;
/** SQL: the indicator aliased `alias` plays the role (the role is a bound literal of this module, never user input). */
export const hasRole = (alias: string, roleCode: string): string =>
  `${alias}.role_id = (select r.id from reference.values r where r.code = '${roleCode}')`;

export const money = (minorUnits: string | number | null): number | null =>
  minorUnits === null ? null : Number(minorUnits) / 100;

/** The wording for a gap: what is missing, where to ask, where to look. */
export const gap = (what: string): string => what;

/** The stored form of an indicator code: seeds write `sta.population.total`, the table stores `sta.ind.sta.population.total`. */
export const indicatorStored = (code: string): string =>
  code.startsWith("sta.ind.") ? code : `sta.ind.${code}`;
export const indicatorShort = (stored: string): string => stored.replace(/^sta\.ind\./, "");

/** Tolerance (degrees) to simplify outlines for a map of units of a kind, so a whole-country map stays small. */
export const toleranceFor = (kindCode: string): number =>
  ({ county: 0.012, constituency: 0.004, ward: 0.0015 })[kindCode] ?? 0.001;

export interface UnitRef {
  id: string;
  kind: string;
}

/**
 * The units a map or ranking covers: the children of `parent` (or of the country when absent), or, when `kind` names a
 * level (county, constituency, ward, town, village, city), every unit of that kind below `parent`.
 */
export async function unitsUnder(
  db: DataSource,
  parentId: string | undefined,
  kind: string | undefined,
): Promise<UnitRef[]> {
  const rows: { id: string; kind: string }[] = await db.query(
    `with recursive root as (
       select coalesce($1::uuid, (select f.id from geography.features f where f.code like '%.ke' and not exists
         (select 1 from geography.relationships r where r.subject_feature_id = f.id) limit 1)) as id),
     down as (
       select r.subject_feature_id as id, 1 as depth from geography.relationships r join root on r.object_feature_id = root.id where r.to_year is null
       union
       select r.subject_feature_id, d.depth + 1 from geography.relationships r join down d on r.object_feature_id = d.id
       where d.depth < 6 and r.to_year is null)
     select distinct f.id, regexp_replace(k.code, '^.*\\.', '') as kind
     from down d join geography.features f on f.id = d.id join reference.values k on k.id = f.feature_type_id
     where ($2::text is null and d.depth = 1) or ($2::text is not null and regexp_replace(k.code, '^.*\\.', '') = $2::text)`,
    [parentId ?? null, kind ?? null],
  );
  return rows;
}

/** `pol.par.ke.party.uda` as written in a seed (`ke.party.uda`), and back. */
export const shortCode = (stored: string): string =>
  stored.replace(/^[a-z][a-z0-9]{1,3}\.[a-z][a-z0-9]{1,3}\./, "");
export const storedCode = (prefix: string, short: string): string =>
  short.startsWith(`${prefix}.`) ? short : `${prefix}.${short}`;

/** Person name of an individual in English (official, preferred first). */
export const personName = (individual: string): string => `coalesce(
  (select n.name from official.names n where n.individual_id = ${individual} order by n.is_preferred desc, n.name limit 1), 'Unknown')`;

/** The party (official name) an individual belongs to now, if any. */
export const partyOf = (individual: string): string => `(
  select ${entityName("pt.entity_id")}
  from politics.memberships m join politics.parties pt on pt.id = m.party_id
  where m.individual_id = ${individual} and m.left_on is null order by m.joined_on desc nulls last limit 1)`;
