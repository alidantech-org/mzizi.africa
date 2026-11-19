/** Legislative and executive activity: motions with every member's position (for a hemicycle), and a leader's record. */
import { NotFoundException } from "@nestjs/common";
import type { DataSource } from "typeorm";

import { featureName, partyOf, personName, shortCode, storedCode, entityName } from "./shared.ts";

const word = (code: string): string => code.replace(/^.*\./, "");

export async function listMotions(db: DataSource, institutionId: string | undefined, limit: number) {
  const rows: Record<string, unknown>[] = await db.query(
    `select m.code, m.title, m.summary, (coalesce(so.actual_starts_on, so.planned_starts_on))::text as held_on, ${entityName("i.entity_id")} as institution, i.id as institution_id,
       regexp_replace(mk.code, '^.*\\.', '') as kind, regexp_replace(oc.code, '^.*\\.', '') as outcome,
       count(*) filter (where vp.code like '%.yes') as yes, count(*) filter (where vp.code like '%.no') as no,
       count(*) filter (where vp.code like '%.abstain') as abstain, count(*) filter (where vp.code like '%.absent') as absent
     from governance.motions m join governance.sittings s on s.id = m.sitting_id join event.occurrences so on so.id = s.occurrence_id join governance.institutions i on i.id = s.institution_id
     join reference.values mk on mk.id = m.motion_kind_id join reference.values oc on oc.id = m.outcome_id
     left join governance.votes v on v.motion_id = m.id left join reference.values vp on vp.id = v.position_id
     where ($1::uuid is null or s.institution_id = $1) group by m.id, (coalesce(so.actual_starts_on, so.planned_starts_on)), i.id, i.entity_id, mk.code, oc.code order by (coalesce(so.actual_starts_on, so.planned_starts_on)) desc limit $2`,
    [institutionId ?? null, Math.min(Math.max(limit, 1), 200)]);
  return { motions: rows.map((r) => ({ ...r, code: shortCode(String(r.code)), yes: Number(r.yes), no: Number(r.no), abstain: Number(r.abstain), absent: Number(r.absent) })) };
}

export async function motionDetail(db: DataSource, code: string) {
  const motions: Record<string, unknown>[] = await db.query(
    `select m.id, m.code, m.title, m.summary, (coalesce(so.actual_starts_on, so.planned_starts_on))::text as held_on, s.title as sitting, i.id as institution_id, ${entityName("i.entity_id")} as institution,
       regexp_replace(mk.code, '^.*\\.', '') as kind, regexp_replace(oc.code, '^.*\\.', '') as outcome, m.instrument_id, m.provision_id, m.budget_version_id, m.fiscal_period_id,
       (select ${personName("h.individual_id")} from governance.holders h where h.id = m.moved_by_holder_id) as moved_by
     from governance.motions m join governance.sittings s on s.id = m.sitting_id join event.occurrences so on so.id = s.occurrence_id join governance.institutions i on i.id = s.institution_id
     join reference.values mk on mk.id = m.motion_kind_id join reference.values oc on oc.id = m.outcome_id where m.code = $1`, [storedCode("gov.mot", code)]);
  const motion = motions[0];
  if (!motion) throw new NotFoundException("No such motion.");
  const members: { holder_id: string; individual_id: string; name: string; party: string | null; party_code: string | null; position: string; unit: string | null; office: string | null }[] = await db.query(
    `select h.id as holder_id, h.individual_id, ${personName("h.individual_id")} as name, ${partyOf("h.individual_id")} as party,
       (select pt.code from politics.memberships mm join politics.parties pt on pt.id = mm.party_id where mm.individual_id = h.individual_id and mm.left_on is null order by mm.joined_on desc nulls last limit 1) as party_code,
       regexp_replace(vp.code, '^.*\\.', '') as position, (select ${featureName("o.unit_feature_id", "'en'")} from governance.offices o where o.id = h.office_id) as unit,
       (select k.label from governance.offices o join reference.values k on k.id = (select p.title_id from governance.positions p where p.id = o.position_id) where o.id = h.office_id) as office
     from governance.votes v join governance.holders h on h.id = v.holder_id join reference.values vp on vp.id = v.position_id where v.motion_id = $1 order by 5, name`, [motion.id]);
  const tally = { yes: 0, no: 0, abstain: 0, absent: 0 } as Record<string, number>;
  const byParty = new Map<string, Record<string, number>>();
  type Row = { party: string } & Record<string, number | string>;
  for (const m of members) {
    tally[m.position] = (tally[m.position] ?? 0) + 1;
    const key = m.party ?? "No party";
    const row = byParty.get(key) ?? { yes: 0, no: 0, abstain: 0, absent: 0 };
    row[m.position] = (row[m.position] ?? 0) + 1;
    byParty.set(key, row);
  }
  let legal: unknown = null;
  if (motion.provision_id) {
    const p: Record<string, unknown>[] = await db.query(
      `select pr.designation, pr.title, (select n.name from legal.names n where n.instrument_id = pr.instrument_id limit 1) as instrument from legal.provisions pr where pr.id = $1`, [motion.provision_id]);
    legal = p[0] ?? null;
  }
  let budget: unknown = null;
  if (motion.fiscal_period_id) {
    const b: Record<string, unknown>[] = await db.query("select fp.code, fp.starts_on::text as starts_on, fp.ends_on::text as ends_on from finance.fiscal_periods fp where fp.id = $1", [motion.fiscal_period_id]);
    budget = b[0] ? { ...b[0], code: shortCode(String(b[0].code)) } : null;
  }
  const speeches: Record<string, unknown>[] = await db.query(
    `select c.summary, c.word_count, regexp_replace(k.code, '^.*\\.', '') as kind, h.id as holder_id, ${personName("h.individual_id")} as name, ${partyOf("h.individual_id")} as party
     from governance.speeches c join governance.holders h on h.id = c.holder_id join reference.values k on k.id = c.speech_kind_id
     where c.motion_id = $1 order by c.word_count desc nulls last limit 30`, [motion.id]);
  const clean = { ...motion, code: shortCode(String(motion.code)), contributions: speeches } as Record<string, unknown>;
  for (const k of ["id", "instrument_id", "provision_id", "budget_version_id", "fiscal_period_id"]) delete clean[k];
  return {
    motion: clean, tally: { ...tally, total: members.length, passed: tally.yes > tally.no },
    parties: [...byParty.entries()].map(([party, counts]): Row => ({ party, ...counts })).sort((a, b) => Number(b.yes) + Number(b.no) - (Number(a.yes) + Number(a.no))),
    members: members.map((m) => ({ holderId: m.holder_id, individualId: m.individual_id, name: m.name, party: m.party, partyCode: m.party_code ? shortCode(m.party_code) : null, position: m.position, unit: m.unit, office: m.office })),
    legal: legal === null && budget === null ? null : { provision: legal, fiscalYear: budget },
    gaps: members.length === 0 ? ["No individual votes were recorded for this motion."] : [],
  };
}

export async function leaderActivity(db: DataSource, individualId: string) {
  const [tally]: { yes: string; no: string; abstain: string; absent: string }[] = await db.query(
    `select count(*) filter (where p.code like '%.yes') as yes, count(*) filter (where p.code like '%.no') as no, count(*) filter (where p.code like '%.abstain') as abstain, count(*) filter (where p.code like '%.absent') as absent
     from governance.votes v join governance.holders h on h.id = v.holder_id join reference.values p on p.id = v.position_id where h.individual_id = $1`, [individualId]);
  const recent: Record<string, unknown>[] = await db.query(
    `select m.code, m.title, (coalesce(so.actual_starts_on, so.planned_starts_on))::text as held_on, regexp_replace(p.code, '^.*\\.', '') as position, regexp_replace(oc.code, '^.*\\.', '') as outcome
     from governance.votes v join governance.holders h on h.id = v.holder_id join governance.motions m on m.id = v.motion_id join governance.sittings s on s.id = m.sitting_id join event.occurrences so on so.id = s.occurrence_id
     join reference.values p on p.id = v.position_id join reference.values oc on oc.id = m.outcome_id where h.individual_id = $1 order by (coalesce(so.actual_starts_on, so.planned_starts_on)) desc limit 12`, [individualId]);
  const [contrib]: { n: string; words: string | null }[] = await db.query(
    `select count(*)::text as n, sum(c.word_count)::text as words from governance.speeches c join governance.holders h on h.id = c.holder_id where h.individual_id = $1`, [individualId]);
  const speeches: Record<string, unknown>[] = await db.query(
    `select m.code as motion_code, m.title as motion, (coalesce(so.actual_starts_on, so.planned_starts_on))::text as held_on, regexp_replace(k.code, '^.*\\.', '') as kind, c.summary, c.word_count
     from governance.speeches c join governance.holders h on h.id = c.holder_id join governance.sittings s on s.id = c.sitting_id join event.occurrences so on so.id = s.occurrence_id
     left join governance.motions m on m.id = c.motion_id join reference.values k on k.id = c.speech_kind_id
     where h.individual_id = $1 order by (coalesce(so.actual_starts_on, so.planned_starts_on)) desc limit 12`, [individualId]);
  const t = { yes: Number(tally?.yes ?? 0), no: Number(tally?.no ?? 0), abstain: Number(tally?.abstain ?? 0), absent: Number(tally?.absent ?? 0) };
  const total = t.yes + t.no + t.abstain + t.absent;
  return {
    votes: { ...t, total, attendance: total ? (total - t.absent) / total : null },
    contributions: { count: Number(contrib?.n ?? 0), words: Number(contrib?.words ?? 0) },
    recent: recent.map((r) => ({ ...r, code: shortCode(String(r.code)) })),
    speeches: speeches.map((r) => ({ ...r, motion_code: r.motion_code ? shortCode(String(r.motion_code)) : null })),
    recorded: total > 0,
  };
}
void word;
