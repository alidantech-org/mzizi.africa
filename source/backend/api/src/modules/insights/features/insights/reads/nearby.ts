/** Projects close to a position, nearest first, using PostGIS geography distance on the project's point. */
import type { DataSource } from "typeorm";

import { featureName, mediaFor, money, shortCode } from "./shared.ts";

export async function nearbyProjects(db: DataSource, latitude: number, longitude: number, radiusKm: number | undefined) {
  const radius = Math.min(Math.max(radiusKm ?? 10, 0.5), 100);
  const rows: Record<string, unknown>[] = await db.query(
    `select p.id, p.code, p.name, regexp_replace(s.code, '^.*\\.', '') as status, ${featureName("p.scope_unit_feature_id", "'en'")} as unit, p.scope_unit_feature_id as unit_id,
       st_distance(p.location::geography, st_setsrid(st_makepoint($2, $1), 4326)::geography) / 1000 as distance_km, st_asgeojson(p.location)::json as location,
       (select sum(fl.amount_minor_units)::text from finance.flows fl where fl.project_id = p.id) as amount,
       (select n.name from civic.contracts c join official.names n on n.entity_id = c.contractor_entity_id where c.project_id = p.id limit 1) as contractor,
       (select n.name from official.names n where n.entity_id = i.entity_id limit 1) as responsible
     from civic.projects p join reference.values s on s.id = p.status_id left join governance.institutions i on i.id = p.responsible_institution_id
     where p.location is not null and st_dwithin(p.location::geography, st_setsrid(st_makepoint($2, $1), 4326)::geography, $3 * 1000)
     order by distance_km limit 40`, [latitude, longitude, radius]);
  const media = await mediaFor(db, "civic.projects", rows.map((r) => String(r.id)), 1);
  return {
    radiusKm: radius,
    projects: rows.map((r) => ({ ...r, id: undefined, code: shortCode(String(r.code)), amount: money(r.amount as string | null), media: media.get(String(r.id))?.[0] ?? null })),
    gaps: rows.length === 0 ? [`No project with a recorded location lies within ${radius} km of this position. Locations are approximate, and many projects record only their area.`] : [],
  };
}
