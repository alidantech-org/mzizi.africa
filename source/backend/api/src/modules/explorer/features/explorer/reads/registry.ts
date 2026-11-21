/**
 * The registered places of one country in one language, read once and kept briefly.
 *
 * A country's routable places are a few thousand rows (Kenya: about 2,100). Building them costs a recursive walk of the
 * slug registry, so every list the location UI needs (children of each ancestor, one level of the country, a search) is
 * answered from this one set instead of running that walk again. Addresses are matched as the readable slugs in the URL.
 */
import { InternalServerErrorException } from "@nestjs/common";
import type { DataSource } from "typeorm";
import { placeCte } from "./queries.ts";

export type RegPlace = {
  featureId: string;
  code: string;
  countryCode: string;
  name: string;
  nameLanguage: string | null;
  kind: string;
  kindCode: string;
  segments: string[];
  canonicalPath: string;
  depth: number;
  parentFeatureId: string | null;
  parentName: string | null;
  citationCount: number;
};

const KEEP_MS = 10 * 60 * 1000;
const kept = new Map<string, { at: number; rows: Promise<RegPlace[]> }>();

const text = (v: unknown, what: string): string => {
  if (typeof v !== "string") throw new InternalServerErrorException(`The place registry returned an invalid ${what}.`);
  return v;
};
const maybeText = (v: unknown): string | null => (typeof v === "string" ? v : null);
const strings = (v: unknown): string[] => {
  if (!Array.isArray(v) || v.some((x) => typeof x !== "string"))
    throw new InternalServerErrorException("The place registry returned an invalid address.");
  return v as string[];
};

async function load(db: DataSource, countryId: string, language: string): Promise<RegPlace[]> {
  const raw: unknown = await db.query(
    `${placeCte} select p.feature_id as "featureId",p.code,p.country_code as "countryCode",p.name,p.language_code as "nameLanguage",
       p.kind,p.kind_code as "kindCode",p.segments,p.parent_feature_id as "parentFeatureId",
       (select count(*)::int from source.citations c where c.subject_table='geography.features' and c.subject_id=p.feature_id and c.deleted_at is null) as "citationCount"
     from places p`,
    [countryId, language],
  );
  if (!Array.isArray(raw)) throw new InternalServerErrorException("The place registry did not return rows.");
  const rows = raw.map((r: Record<string, unknown>): RegPlace => {
    const segments = strings(r.segments);
    return {
      featureId: text(r.featureId, "identity"),
      code: text(r.code, "code"),
      countryCode: text(r.countryCode, "country"),
      name: text(r.name, "name"),
      nameLanguage: maybeText(r.nameLanguage),
      kind: text(r.kind, "kind"),
      kindCode: text(r.kindCode, "kind code"),
      segments,
      canonicalPath: `/${[String(r.countryCode).toLowerCase(), ...segments.map(encodeURIComponent)].join("/")}`,
      depth: segments.length,
      parentFeatureId: maybeText(r.parentFeatureId),
      parentName: null,
      citationCount: typeof r.citationCount === "number" ? r.citationCount : 0,
    };
  });
  const names = new Map<string, string>();
  for (const r of [...rows].sort((a, b) => a.depth - b.depth)) if (!names.has(r.featureId)) names.set(r.featureId, r.name);
  for (const r of rows) r.parentName = r.parentFeatureId ? (names.get(r.parentFeatureId) ?? null) : null;
  return rows.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()) || a.featureId.localeCompare(b.featureId) || a.canonicalPath.localeCompare(b.canonicalPath));
}

export function registry(db: DataSource, countryId: string, language: string): Promise<RegPlace[]> {
  const key = `${countryId}:${language}`;
  const hit = kept.get(key);
  if (hit && Date.now() - hit.at < KEEP_MS) return hit.rows;
  const rows = load(db, countryId, language);
  kept.set(key, { at: Date.now(), rows });
  rows.catch(() => kept.delete(key)); // a failure is never kept
  return rows;
}

export const addressOf = (place: Pick<RegPlace, "segments">): string => place.segments.join("/");

/** The place at a readable address below the country (empty for the country itself), as written in the URL. */
export function atPath(rows: readonly RegPlace[], segments: readonly string[]): RegPlace | undefined {
  const want = segments.join("/");
  return rows.find((r) => addressOf(r) === want);
}

/** The places directly inside one place, in name order. */
export function insideOf(rows: readonly RegPlace[], place: RegPlace): RegPlace[] {
  const prefix = place.segments.join("/");
  return rows.filter(
    (r) =>
      r.parentFeatureId === place.featureId &&
      r.segments.length === place.segments.length + 1 &&
      r.segments.slice(0, place.segments.length).join("/") === prefix,
  );
}
