/** The leaders tree: national leaders, then the county, constituency, ward and any smaller unit of a place, by how they got the seat. */
import type { DataSource } from "typeorm";

import { crumbs, featureName, mediaFor, partyOf, personName, shortCode } from "./shared.ts";

interface Row {
  holder_id: string; individual_id: string; name: string; party: string | null; office: string; office_code: string; unit_id: string | null; unit: string | null;
  how: string; took_office_on: string | null; institution: string | null;
}

export async function leaderTree(db: DataSource, featureId: string | undefined) {
  const chain = featureId ? await crumbs(db, featureId) : [];
  const unitIds = chain.map((c) => c.featureId);
  const rows: Row[] = await db.query(
    `select h.id as holder_id, h.individual_id, ${personName("h.individual_id")} as name, ${partyOf("h.individual_id")} as party,
       (select k.label from reference.values k where k.id = o.office_kind_id) as office, o.code as office_code, o.unit_feature_id as unit_id,
       ${featureName("o.unit_feature_id", "'en'")} as unit, regexp_replace(ak.code, '^.*\\.', '') as how, h.took_office_on::text,
       (select n.name from official.names n join governance.institutions i on i.entity_id = n.entity_id where i.id = o.institution_id limit 1) as institution
     from governance.holders h join governance.offices o on o.id = h.office_id left join reference.values ak on ak.id = h.appointment_kind_id
     where h.left_office_on is null and (o.unit_feature_id is null or o.unit_feature_id = any($1::uuid[]) or (cardinality($1::uuid[]) = 0 and o.unit_feature_id in
       (select f.id from geography.features f join reference.values k on k.id = f.feature_type_id where k.code like '%.country')))
     order by o.code`, [unitIds]);
  const media = await mediaFor(db, "official.individuals", rows.map((r) => r.individual_id), 1);
  const toLeader = (r: Row) => ({ holderId: r.holder_id, name: r.name, party: r.party, office: r.office, institution: r.institution, how: r.how ?? "elected", since: r.took_office_on, photo: media.get(r.individual_id)?.[0]?.url ?? null, code: shortCode(r.office_code) });
  const groups = (list: Row[]) => {
    const g: Record<string, ReturnType<typeof toLeader>[]> = { elected: [], appointed: [], nominated: [] };
    for (const r of list) (g[r.how] ??= []).push(toLeader(r));
    return g;
  };
  const national = rows.filter((r) => r.unit_id === null || chain.length === 0 || chain[0]?.featureId === r.unit_id);
  const levels: Record<string, unknown>[] = [{ level: "national", label: "The whole country", unit: chain[0] ?? null, total: national.length, groups: groups(national) }];
  for (const unit of chain.slice(1)) {
    const here = rows.filter((r) => r.unit_id === unit.featureId);
    levels.push({ level: unit.kindCode.replace(/^.*\./, ""), label: unit.kindLabel, unit, total: here.length, groups: groups(here) });
  }
  return {
    place: chain.at(-1) ?? null, levels,
    gaps: levels.some((l) => (l.total as number) === 0) ? ["Some levels have no leader recorded. Smaller units such as towns and villages rarely have an elected office."] : [],
  };
}
