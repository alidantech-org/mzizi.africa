/** Hierarchy browsing (county, constituency, ward, town, village) with the path to the current unit. */
import type { DataSource } from "typeorm";

import { crumbs, latestBaseline, mediaFor, POPULATION, featureName, valueLabel } from "./shared.ts";

interface ChildRow {
  feature_id: string;
  name: string;
  kind_code: string;
  kind_label: string;
  child_count: string;
  population: string | null;
}

export async function browsePlaces(db: DataSource, featureId: string | undefined) {
  let id = featureId;
  if (id === undefined) {
    const root: { id: string }[] = await db.query(
      "select f.id from geography.features f where f.code like '%.ke' and not exists (select 1 from geography.relationships r where r.subject_feature_id = f.id) limit 1",
    );
    id = root[0]?.id;
  }
  if (id === undefined) return { place: null, chain: [], children: [], media: [] };
  const chain = await crumbs(db, id);
  const children: ChildRow[] = await db.query(
    `select f.id as feature_id, ${featureName("f.id", "$2")} as name, k.code as kind_code, ${valueLabel("k.id", "$2")} as kind_label,
       (select count(*) from geography.relationships c where c.object_feature_id = f.id and c.to_year is null)::text as child_count,
       ${latestBaseline(POPULATION, "f.id")}::text as population
     from (select distinct r.subject_feature_id as id from geography.relationships r where r.object_feature_id = $1 and r.to_year is null) s
     join geography.features f on f.id = s.id
     join reference.values k on k.id = f.feature_type_id
     order by ${featureName("f.id", "$2")}`,
    [id, "en"],
  );
  const media = await mediaFor(db, "geography.features", [id], 10);
  return {
    place: chain[chain.length - 1] ?? null,
    media: media.get(id) ?? [],
    chain,
    children: children.map((row) => ({
      featureId: row.feature_id,
      name: row.name,
      kindCode: row.kind_code.replace(/^.*\./, ""),
      kindLabel: row.kind_label,
      childCount: Number(row.child_count),
      population: row.population === null ? null : Number(row.population),
    })),
  };
}
