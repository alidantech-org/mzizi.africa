/** A leader: office and tenure, contacts, media, voting record, the fund they oversee, how they won, and evidence. */
import { NotFoundException } from "@nestjs/common";
import type { DataSource } from "typeorm";

import { evidenceFor } from "#/modules/locality/features/places/reads/evidence.ts";
import { leaderActivity } from "./activity.ts";
import { placeCivic } from "./civic.ts";
import { featureName, mediaFor, partyOf, personName, shortCode } from "./shared.ts";

interface HolderRow {
  id: string; individual_id: string; office_id: string; name: string; party: string | null; office: string; unit_id: string | null; unit: string | null;
  institution: string | null; took_office_on: string | null; birth_date: string | null; entity_id: string | null;
}

export async function leaderProfile(db: DataSource, holderId: string) {
  const rows: HolderRow[] = await db.query(
    `select h.id, h.individual_id, h.office_id, ${personName("h.individual_id")} as name, ${partyOf("h.individual_id")} as party,
       (select k.label from reference.values k where k.id = o.office_kind_id) as office, o.unit_feature_id as unit_id, ${featureName("o.unit_feature_id", "'en'")} as unit,
       (select n.name from official.names n where n.entity_id = i.entity_id limit 1) as institution, h.took_office_on::text, ind.birth_date::text, i.entity_id
     from governance.holders h join governance.offices o on o.id = h.office_id join official.individuals ind on ind.id = h.individual_id
     left join governance.institutions i on i.id = o.institution_id where h.id = $1`, [holderId]);
  const holder = rows[0];
  if (!holder) throw new NotFoundException("No such leader.");
  const offices: Record<string, unknown>[] = await db.query(
    `select h.id as "holderId", (select k.label from reference.values k where k.id = o.office_kind_id) as office, ${featureName("o.unit_feature_id", "'en'")} as unit,
       h.took_office_on::text as "tookOfficeOn", h.left_office_on::text as "leftOfficeOn"
     from governance.holders h join governance.offices o on o.id = h.office_id where h.individual_id = $1 order by h.took_office_on desc nulls last`, [holder.individual_id]);
  const contacts: { kind: string; value: string; visibility: string; scope: string }[] = await db.query(
    `select regexp_replace(k.code, '^.*\\.', '') as kind, c.value, regexp_replace(v.code, '^.*\\.', '') as visibility, case when c.individual_id is not null then 'personal' else 'office' end as scope
     from official.contacts c join reference.values k on k.id = c.kind_id join reference.values v on v.id = c.visibility_id
     where (c.individual_id = $1 or c.entity_id = $2::uuid) and v.code like '%.public' order by scope, k.code`, [holder.individual_id, holder.entity_id]);
  const media = await mediaFor(db, "official.individuals", [holder.individual_id], 6);
  const activity = await leaderActivity(db, holder.individual_id);
  const election: Record<string, unknown>[] = await db.query(
    `select substring(e.code from '(\\d{4})$')::int as year, e.held_on::text as "heldOn", r.votes::float8 as votes,
       (select sum(r2.votes)::float8 from politics.results r2 join politics.candidates c2 on c2.id = r2.candidate_id where c2.contest_id = c.id and r2.unit_feature_id = r.unit_feature_id) as total,
       (select max(r2.votes)::float8 from politics.results r2 join politics.candidates c2 on c2.id = r2.candidate_id where c2.contest_id = c.id and r2.unit_feature_id = r.unit_feature_id and c2.id <> ca.id) as runner_up,
       el.registered_voters::float8 as registered, (select count(*) from politics.candidates c3 where c3.contest_id = c.id)::int as candidates
     from politics.candidates ca join politics.contests c on c.id = ca.contest_id and c.office_id = $2 join politics.elections e on e.id = c.election_id
     join politics.results r on r.candidate_id = ca.id left join politics.electorates el on el.contest_id = c.id and el.unit_feature_id = r.unit_feature_id
     where ca.individual_id = $1 order by e.held_on desc`, [holder.individual_id, holder.office_id]);
  let fund: unknown = null;
  if (holder.unit_id && /constituency|member of parliament/i.test(holder.office)) {
    const civic = await placeCivic(db, holder.unit_id);
    fund = { place: civic.place, fund: civic.fund, latestYear: civic.years[0] ?? null, classes: civic.classes, infrastructure: civic.infrastructure, projects: civic.projects.slice(0, 6) };
  }
  const evidence = await evidenceFor(db, "governance.holders", [holderId]);
  const gaps: string[] = [];
  if (!contacts.some((c) => c.scope === "personal")) gaps.push("No personal contact details are published for this leader. You can ask for them, or check the official directory yourself.");
  if (!activity.recorded) gaps.push("No votes or contributions are recorded for this leader.");
  if (election.length === 0) gaps.push("The election that put this leader in office is not recorded.");
  return {
    leader: { holderId: holder.id, individualId: holder.individual_id, name: holder.name, party: holder.party, office: holder.office, unitId: holder.unit_id, unit: holder.unit, institution: holder.institution, tookOfficeOn: holder.took_office_on, birthDate: holder.birth_date },
    offices,
    contacts,
    media: media.get(holder.individual_id) ?? [],
    activity,
    election: election.map((e) => ({ ...e, share: e.total ? Number(e.votes) / Number(e.total) : null, margin: e.total && e.runner_up !== null ? (Number(e.votes) - Number(e.runner_up)) / Number(e.total) : null })),
    fund,
    evidence: evidence.get(holderId) ?? [],
    gaps,
  };
}
void shortCode;
