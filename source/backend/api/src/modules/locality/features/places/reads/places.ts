/**
 * Place reads: which unit contains a position, the chain of units above it and a name search.
 *
 * The chain follows `part-of` relationships (electoral first, then administrative), not code prefixes, so it keeps
 * working when a boundary or parent changes. Positions are matched against current outline geometries and the
 * smallest containing outline wins.
 */
import type { DataSource } from "typeorm";

import type { LocalityUnit } from "#/modules/locality/schema/interface/locality-unit.interface.ts";
import { featureName, valueLabel } from "#/modules/locality/features/places/reads/language.ts";

interface UnitRow {
  feature_id: string;
  code: string;
  kind_code: string;
  kind_label: string;
  name: string;
  hops: number;
}

const toUnit = (row: UnitRow, depth: number): LocalityUnit => ({
  featureId: row.feature_id,
  code: row.code,
  kindCode: row.kind_code,
  kindLabel: row.kind_label,
  name: row.name,
  depth,
});

/** `lang` is the SQL placeholder of the language parameter (for example `$2`), never a value. */
const unitColumns = (lang: string): string => `f.id as feature_id, f.code, k.code as kind_code,
  ${valueLabel("k.id", lang)} as kind_label, ${featureName("f.id", lang)} as name`;

/** The id of the smallest current outline that contains the position, or null when no unit is recorded there. */
export async function featureAt(
  db: DataSource,
  latitude: number,
  longitude: number,
): Promise<string | null> {
  const rows: { feature_id: string }[] = await db.query(
    `select g.feature_id from geography.geometries g
     join reference.values role on role.id = g.geometry_role_id and role.code = 'ref.val.geo.geometry.role.outline'
     where g.to_year is null and g.geometry && st_setsrid(st_makepoint($1, $2), 4326)
       and st_contains(g.geometry, st_setsrid(st_makepoint($1, $2), 4326))
     order by g.area asc limit 1`,
    [longitude, latitude],
  );
  return rows[0]?.feature_id ?? null;
}

/** The place and the units above it, widest first (the country has depth 0). Empty when the feature does not exist. */
export async function chainOf(
  db: DataSource,
  featureId: string,
  lang: string,
): Promise<LocalityUnit[]> {
  const rows: UnitRow[] = await db.query(
    `with recursive up as (
       select f.id, 0 as hops, array[f.id] as seen from geography.features f where f.id = $1
       union all
       select parent.id, up.hops + 1, up.seen || parent.id
       from up
       join lateral (
         select r.object_feature_id as id from geography.relationships r
         join reference.values kind on kind.id = r.relationship_kind_id and kind.code = 'ref.val.geo.relationship.kind.part-of'
         join reference.values sys on sys.id = r.system_id
         where r.subject_feature_id = up.id and r.to_year is null
         order by (sys.code = 'ref.val.geo.relationship.system.electoral') desc,
                  (sys.code = 'ref.val.geo.relationship.system.administrative') desc
         limit 1) parent on true
       where not parent.id = any(up.seen) and up.hops < 8)
     select ${unitColumns("$2")}, up.hops
     from up join geography.features f on f.id = up.id
     join reference.values k on k.id = f.feature_type_id
     order by up.hops desc`,
    [featureId, lang],
  );
  return rows.map((row, index) => toUnit(row, index));
}

/** Places whose name in any language contains the text, exact matches first, then narrower units. */
export async function searchPlaces(
  db: DataSource,
  text: string,
  lang: string,
  limit: number,
): Promise<LocalityUnit[]> {
  const rows: UnitRow[] = await db.query(
    `select ${unitColumns("$3")}, 0 as hops
     from geography.features f join reference.values k on k.id = f.feature_type_id
     where exists (select 1 from geography.names n where n.feature_id = f.id and n.name ilike '%' || $1 || '%')
     order by exists (select 1 from geography.names n where n.feature_id = f.id and lower(n.name) = lower($1)) desc,
              exists (select 1 from geography.names n where n.feature_id = f.id and n.name ilike $1 || '%') desc,
              array_length(string_to_array(f.code, '.'), 1) desc, f.code
     limit $2`,
    [text, Math.min(Math.max(limit, 1), 100), lang],
  );
  // Depth here counts the dotted levels below the country segment, which is how unit codes nest.
  return rows.map((row) => toUnit(row, Math.max(row.code.split(".").length - 3, 0)));
}
