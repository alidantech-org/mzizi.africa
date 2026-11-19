/** Civic infrastructure: facilities by class and place with capacity and coordinates, and one facility with the stations it hosts. */
import { FACILITY_CAPACITY, hasRole } from "#/modules/insights/features/insights/reads/shared.ts";
import type { DataSource } from "typeorm";
import { entityName } from "#/modules/locality/features/places/reads/language.ts";

import { crumbs, descendantIds, featureName, indicatorShort, lastWord, shortCode, valueLabel } from "#/modules/insights/features/insights/reads/shared.ts";
import { placeRefs, slugPath } from "./context.ts";

interface ClassRow { id: string; code: string; parent_id: string | null; label: string }

async function classes(db: DataSource, lang: string): Promise<Map<string, ClassRow>> {
  const rows: ClassRow[] = await db.query(
    `select v.id, v.code, v.parent_id, ${valueLabel("v.id", "$1")} as label from reference.values v
      join reference.schemes s on s.id = v.scheme_id and s.code = 'ref.sch.civ.facility.class'`,
    [lang],
  );
  return new Map(rows.map((r) => [r.id, r]));
}

function domainOf(map: Map<string, ClassRow>, id: string): ClassRow {
  let cur = map.get(id)!;
  while (cur.parent_id && map.has(cur.parent_id)) cur = map.get(cur.parent_id)!;
  return cur;
}

const SELECT = `select f.code, ${"${NAME}"} as name, f.facility_class_id as class_id, f.feature_id,
    ${entityName("f.operator_entity_id")} as operator,
    (select ${valueLabel("ow.id", "$1")} from reference.values ow where ow.id = f.ownership_id) as ownership_label,
    ${valueLabel("st.id", "$1")} as status_label, ST_Y(gc.centroid) as latitude, ST_X(gc.centroid) as longitude
  from civic.facilities f join reference.values st on st.id = f.status_id
  left join lateral (select g.centroid from geography.geometries g join reference.values r on r.id = g.geometry_role_id and r.code = 'ref.val.geo.geometry.role.label-point'
                      where g.feature_id = f.feature_id limit 1) gc on true`.replace("${NAME}", featureName("f.feature_id", "$1"));

async function capacity(db: DataSource, featureIds: string[]) {
  if (featureIds.length === 0) return new Map<string, { indicatorCode: string; label: string; value: number }[]>();
  const rows: { feature_id: string; code: string; name: string; value: string }[] = await db.query(
    `select distinct on (o.feature_id, i.code) o.feature_id, i.code, i.name, o.value::text from statistics.observations o
       join statistics.indicators i on i.id = o.indicator_id where o.feature_id = any($1) and ${hasRole("i", FACILITY_CAPACITY)}
      order by o.feature_id, i.code, o.period_from desc`,
    [featureIds],
  );
  const out = new Map<string, { indicatorCode: string; label: string; value: number }[]>();
  for (const r of rows) out.set(r.feature_id, [...(out.get(r.feature_id) ?? []), { indicatorCode: indicatorShort(r.code), label: r.name, value: Number(r.value) }]);
  return out;
}

async function rowsFor(db: DataSource, lang: string, where: string, params: unknown[]) {
  const map = await classes(db, lang);
  const rows: Record<string, unknown>[] = await db.query(`${SELECT} where f.deleted_at is null ${where}`, [lang, ...params]);
  const caps = await capacity(db, rows.map((r) => String(r.feature_id)));
  const out = [];
  for (const r of rows) {
    const cls = map.get(String(r.class_id))!;
    const domain = domainOf(map, cls.id);
    const chain = await placeRefs(db, String(r.feature_id), lang).catch(() => []);
    const near = await db.query(
      `select r.object_feature_id as id from geography.relationships r where r.subject_feature_id = $1 and r.to_year is null limit 1`, [r.feature_id]) as { id: string }[];
    const place = near[0] ? (await crumbs(db, near[0].id, lang)).slice(-1)[0] : undefined;
    out.push({
      code: shortCode(String(r.code)), name: r.name, classCode: lastWord(cls.code), classLabel: cls.label, domainCode: lastWord(domain.code), domainLabel: domain.label,
      operator: r.operator, ownershipLabel: r.ownership_label, statusLabel: r.status_label, featureId: r.feature_id,
      placeName: place?.name ?? chain[chain.length - 1]?.name ?? null,
      placePath: place ? await slugPath(db, place.featureId) : null,
      latitude: r.latitude === null ? null : Number(r.latitude), longitude: r.longitude === null ? null : Number(r.longitude),
      capacity: caps.get(String(r.feature_id)) ?? [],
    });
  }
  return { out, map };
}

export async function listFacilities(
  db: DataSource,
  input: { classCode?: string; featureId?: string; query?: string; languageCode?: string; limit?: number },
) {
  const lang = input.languageCode ?? "en";
  const map = await classes(db, lang);
  let classIds: string[] | null = null;
  if (input.classCode) {
    const root = [...map.values()].find((c) => c.code === input.classCode || c.code.endsWith(`.${input.classCode!.replace(/^civ\.facility\.class\./, '')}`));
    if (root) {
      const ids = new Set([root.id]);
      let grew = true;
      while (grew) {
        grew = false;
        for (const c of map.values()) if (c.parent_id && ids.has(c.parent_id) && !ids.has(c.id)) { ids.add(c.id); grew = true; }
      }
      classIds = [...ids];
    } else classIds = [];
  }
  const places = input.featureId ? await descendantIds(db, input.featureId) : null;
  const where = ` and ($2::uuid[] is null or f.facility_class_id = any($2)) and ($3::uuid[] is null or f.feature_id = any($3))
    and ($4::text is null or ${featureName("f.feature_id", "$1")} ilike '%' || $4 || '%') order by name limit $5`;
  const limit = Math.min(Math.max(input.limit ?? 60, 1), 300);
  const { out } = await rowsFor(db, lang, where.replace("order by name", `order by ${featureName("f.feature_id", "$1")}`), [classIds, places, input.query ?? null, limit]);
  const counts: { class_id: string; n: string }[] = await db.query(
    `select f.facility_class_id as class_id, count(*)::text as n from civic.facilities f where f.deleted_at is null
        and ($1::uuid[] is null or f.feature_id = any($1)) group by 1`, [places]);
  const inClass = classIds ? new Set(classIds) : null;
  const total = counts.reduce((sum, c) => (inClass === null || inClass.has(c.class_id) ? sum + Number(c.n) : sum), 0);
  const rollup = new Map<string, number>();
  for (const c of counts) {
    let cur: ClassRow | undefined = map.get(c.class_id);
    while (cur) { rollup.set(cur.id, (rollup.get(cur.id) ?? 0) + Number(c.n)); cur = cur.parent_id ? map.get(cur.parent_id) : undefined; }
  }
  return {
    total,
    facilities: out,
    classes: [...map.values()].filter((c) => rollup.has(c.id)).map((c) => ({
      code: lastWord(c.code), label: c.label, parentCode: c.parent_id ? lastWord(map.get(c.parent_id)?.code ?? '') || null : null, count: rollup.get(c.id)!,
    })),
    gaps: total === 0 ? ["No facilities are recorded here. That can mean none exist or that no register has been collected for this place yet."] : [],
  };
}

export async function getFacility(db: DataSource, input: { code: string; languageCode?: string }) {
  const lang = input.languageCode ?? "en";
  const { out } = await rowsFor(db, lang, ` and (f.code = $2 or right(f.code, length($2) + 1) = '.' || $2) limit 1`, [input.code]);
  const facility = out[0];
  if (!facility) return null;
  const stations: Record<string, unknown>[] = await db.query(
    `select ${featureName("p.station_feature_id", "$2")} as station_name, e.code as election_code, extract(year from e.held_on)::int as election_year,
       ${valueLabel("ps.id", "$2")} as status_label, p.registered_voters::text as registered_voters, p.stream_count,
       (select el.ballots_cast::text from politics.electorates el where el.unit_feature_id = p.station_feature_id limit 1) as ballots_cast
     from geography.relationships r join reference.values rk on rk.id = r.relationship_kind_id and rk.code = 'ref.val.geo.relationship.kind.located-on'
     join politics.polls p on p.station_feature_id = r.subject_feature_id join politics.elections e on e.id = p.election_id join reference.values ps on ps.id = p.status_id
     where r.object_feature_id = $1 and r.to_year is null order by e.held_on desc`,
    [facility.featureId, lang],
  );
  const chain = await placeRefs(db, String(facility.featureId), lang).catch(() => []);
  return {
    facility,
    chain,
    stations: stations.map((s) => ({
      stationName: s.station_name, electionCode: shortCode(String(s.election_code)), electionYear: Number(s.election_year), statusLabel: s.status_label,
      registeredVoters: s.registered_voters === null ? null : Number(s.registered_voters), streamCount: s.stream_count ?? null,
      ballotsCast: s.ballots_cast === null ? null : Number(s.ballots_cast),
    })),
    gaps: [],
  };
}
