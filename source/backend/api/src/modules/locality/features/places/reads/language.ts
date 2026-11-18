/**
 * Language handling shared by the locality reads: a requested language code (`sw`) is matched to `reference.languages`
 * through its ISO 639-1 code, and every name or label falls back to English and then to whatever exists. Written by
 * hand; Dryv scaffolds only the use cases.
 */
import type { DataSource } from "typeorm";

import type { LanguageChoice } from "#/modules/locality/schema/interface/language-choice.interface.ts";

/** The language every read falls back to when the requested one has no name or label. */
export const FALLBACK_LANGUAGE = "en";

/** A place's name in a language: the requested one, else the fallback, else its default name, else its code. */
export const featureName = (feature: string, lang: string): string => `coalesce(
  (select n.name from geography.names n join reference.languages l on l.id = n.language_id
    where n.feature_id = ${feature} and l.iso6391 = ${lang} order by n.is_default desc, n.name limit 1),
  (select n.name from geography.names n join reference.languages l on l.id = n.language_id
    where n.feature_id = ${feature} and l.iso6391 = '${FALLBACK_LANGUAGE}' order by n.is_default desc, n.name limit 1),
  (select n.name from geography.names n where n.feature_id = ${feature} order by n.is_default desc, n.name limit 1),
  (select f0.code from geography.features f0 where f0.id = ${feature}))`;

/** A reference value's label in a language, falling back to English and then to the last word of its code. */
export const valueLabel = (value: string, lang: string): string => `coalesce(
  (select vl.label from reference.value_labels vl join reference.languages l on l.id = vl.language_id
    where vl.value_id = ${value} and l.iso6391 = ${lang} limit 1),
  (select vl.label from reference.value_labels vl join reference.languages l on l.id = vl.language_id
    where vl.value_id = ${value} and l.iso6391 = '${FALLBACK_LANGUAGE}' limit 1),
  (select v1.label from reference.values v1 where v1.id = ${value}),
  (select initcap(replace(regexp_replace(v0.code, '^.*\\.', ''), '-', ' ')) from reference.values v0 where v0.id = ${value}))`;

/** The language to serve: the requested one when the system knows it, else the fallback. */
export async function servedLanguage(
  db: DataSource,
  requested: string | undefined,
): Promise<string> {
  if (requested === undefined) return FALLBACK_LANGUAGE;
  const rows: { code: string }[] = await db.query(
    "select iso6391 as code from reference.languages where iso6391 = $1",
    [requested.toLowerCase()],
  );
  return rows[0]?.code ?? FALLBACK_LANGUAGE;
}

interface LanguageRow {
  code: string;
  name: string;
  native_name: string | null;
}

/** The languages that have a two-letter code, with their own-language name where the system holds one. */
export async function languageChoices(db: DataSource): Promise<LanguageChoice[]> {
  const rows: LanguageRow[] = await db.query(`
    select l.iso6391 as code, l.name,
      (select ln.name from reference.language_names ln where ln.language_id = l.id and ln.in_language_id = l.id limit 1) as native_name
    from reference.languages l where l.iso6391 is not null order by l.iso6391`);
  return rows.map((row) => ({ code: row.code, name: row.name, nativeName: row.native_name }));
}

/**
 * The display name of an organisation: its preferred full name with its abbreviation in brackets when it has one, for example
 * `Independent Electoral and Boundaries Commission (IEBC)`. Every list, card and title shows names this way, so people who know
 * an institution by its abbreviation recognise it. An organisation without an abbreviation shows its name alone.
 */
export const entityName = (entityId: string): string => `(select o.name || coalesce(' (' || ab.name || ')', '')
    from official.names o join reference.values ok on ok.id = o.name_kind_id
    left join lateral (select a.name from official.names a join reference.values ak on ak.id = a.name_kind_id and ak.code = 'ref.val.ofc.name.kind.abbreviation'
                        where a.entity_id = o.entity_id and a.deleted_at is null order by a.is_preferred desc, a.name limit 1) ab on true
   where o.entity_id = ${entityId} and o.deleted_at is null and ok.code <> 'ref.val.ofc.name.kind.abbreviation'
   order by o.is_preferred desc, (ok.code = 'ref.val.ofc.name.kind.official') desc, o.name limit 1)`;
