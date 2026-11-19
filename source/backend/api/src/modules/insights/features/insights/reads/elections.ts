/**
 * Elections: the list of elections, one election's results by unit (tables and heat maps), a place's election history
 * with the registration trend, and political parties ranked by members, votes, seats and fund allocation.
 */
import { NotFoundException } from "@nestjs/common";
import type { DataSource } from "typeorm";

import { crumbs, featureName, mediaFor, partyOf, personName, shortCode, storedCode, toleranceFor, unitsUnder, entityName, REGISTERED_VOTERS, hasRole } from "./shared.ts";

interface ContestRow { contest_id: string; code: string; kind: string }
interface ResultRow {
  unit_id: string; unit_name: string; unit_kind: string; contest_code: string; candidate: string; candidate_code: string; individual_id: string;
  party: string | null; party_code: string | null; votes: number; registered: number | null; cast: number | null; valid: number | null; rejected: number | null; geometry: unknown;
}

const year = (code: string): number => Number(/(\d{4})$/.exec(code)?.[1] ?? 0);

export async function listElections(db: DataSource) {
  const rows: { id: string; code: string; held_on: string; kind: string }[] = await db.query(
    `select e.id, e.code, e.held_on::text, regexp_replace(k.code, '^.*\\.', '') as kind from politics.elections e join reference.values k on k.id = e.election_kind_id order by e.held_on desc`);
  const out = [];
  for (const e of rows) {
    const [stats]: { contests: string; registered: string | null; valid: string | null }[] = await db.query(
      `select count(*)::text as contests, max(el.registered_voters)::text as registered, max(el.valid_ballots)::text as valid
       from politics.contests c left join politics.electorates el on el.contest_id = c.id and el.unit_feature_id = (select f.id from geography.features f where f.code like '%.ke' and not exists (select 1 from geography.relationships r where r.subject_feature_id = f.id) limit 1)
       where c.election_id = $1`, [e.id]);
    const winner: { name: string; party: string | null; votes: string }[] = await db.query(
      `select ${personName("ca.individual_id")} as name, (select n.name from official.names n join politics.parties pt on pt.entity_id = n.entity_id where pt.id = ca.party_id_at_election limit 1) as party, sum(r.votes)::text as votes
       from politics.candidates ca join politics.contests c on c.id = ca.contest_id and c.code like '%.presidential' join politics.results r on r.candidate_id = ca.id
       where c.election_id = $1 group by ca.id, ca.individual_id, ca.party_id_at_election order by sum(r.votes) desc limit 2`, [e.id]);
    out.push({
      electionId: e.id, code: shortCode(e.code), year: year(e.code), heldOn: e.held_on, kind: e.kind, contests: Number(stats?.contests ?? 0),
      registeredVoters: stats?.registered ? Number(stats.registered) : null, validVotes: stats?.valid ? Number(stats.valid) : null,
      winner: winner[0] ? { name: winner[0].name, party: winner[0].party, votes: Number(winner[0].votes) } : null,
      runnerUp: winner[1] ? { name: winner[1].name, party: winner[1].party, votes: Number(winner[1].votes) } : null,
    });
  }
  return { elections: out };
}

export async function electionDetail(db: DataSource, electionId: string, parentId: string | undefined, contestKind: string | undefined) {
  const election: { id: string; code: string; held_on: string }[] = await db.query("select id, code, held_on::text from politics.elections where id = $1", [electionId]);
  if (election.length === 0) throw new NotFoundException("No such election.");
  const kinds: { kind: string; contests: string }[] = await db.query(
    `select regexp_replace(k.code, '^.*\\.', '') as kind, count(*)::text as contests from politics.contests c join reference.values k on k.id = c.contest_kind_id where c.election_id = $1 group by 1 order by 1`, [electionId]);
  const kind = contestKind ?? (kinds.some((k) => k.kind === "presidential") ? "presidential" : kinds[0]?.kind);
  const level = kind === "member-of-parliament" ? "constituency" : "county";
  const units = await unitsUnder(db, parentId, kind === "presidential" || kind === "governor" ? "county" : level);
  const tolerance = toleranceFor(level);
  const rows: ResultRow[] = units.length === 0 ? [] : await db.query(
    `select r.unit_feature_id as unit_id, ${featureName("r.unit_feature_id", "'en'")} as unit_name, c.code as contest_code, ca.code as candidate_code, ca.individual_id, r.votes::float8 as votes,
       ${personName("ca.individual_id")} as candidate,
       (select n.name from official.names n join politics.parties pt on pt.entity_id = n.entity_id where pt.id = ca.party_id_at_election limit 1) as party,
       (select pt.code from politics.parties pt where pt.id = ca.party_id_at_election) as party_code,
       el.registered_voters::float8 as registered, el.ballots_cast::float8 as cast, el.valid_ballots::float8 as valid, el.rejected_ballots::float8 as rejected,
       (select st_asgeojson(st_simplifypreservetopology(g.geometry, $4), 4)::json from geography.geometries g
          join reference.values gr on gr.id = g.geometry_role_id and gr.code = 'ref.val.geo.geometry.role.outline' where g.feature_id = r.unit_feature_id and g.to_year is null limit 1) as geometry
     from politics.results r join politics.candidates ca on ca.id = r.candidate_id join politics.contests c on c.id = ca.contest_id
     join reference.values k on k.id = c.contest_kind_id and regexp_replace(k.code, '^.*\\.', '') = $2
     left join politics.electorates el on el.contest_id = c.id and el.unit_feature_id = r.unit_feature_id
     where c.election_id = $1 and r.unit_feature_id = any($3::uuid[])`,
    [electionId, kind, units.map((u) => u.id), tolerance]);
  const grouped = new Map<string, ResultRow[]>();
  for (const row of rows) grouped.set(row.unit_id, [...(grouped.get(row.unit_id) ?? []), row]);
  const unitsOut = [...grouped.values()].map((list) => {
    const sorted = [...list].sort((a, b) => b.votes - a.votes);
    const total = sorted.reduce((a, r) => a + r.votes, 0);
    const first = sorted[0]!;
    return {
      featureId: first.unit_id, name: first.unit_name, geometry: first.geometry, registered: first.registered, ballotsCast: first.cast, validVotes: first.valid ?? total, rejected: first.rejected,
      turnout: first.registered && first.cast ? first.cast / first.registered : null,
      winner: { name: first.candidate, party: first.party, partyCode: first.party_code ? shortCode(first.party_code) : null, votes: first.votes, share: total ? first.votes / total : 0, margin: sorted[1] && total ? (first.votes - sorted[1].votes) / total : null },
      candidates: sorted.map((r) => ({ name: r.candidate, party: r.party, partyCode: r.party_code ? shortCode(r.party_code) : null, votes: r.votes, share: total ? r.votes / total : 0 })),
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
  const national = unitsOut.reduce((acc, u) => {
    for (const c of u.candidates) {
      const e = acc.get(c.name) ?? { name: c.name, party: c.party, partyCode: c.partyCode, votes: 0 };
      e.votes += c.votes;
      acc.set(c.name, e);
    }
    return acc;
  }, new Map<string, { name: string; party: string | null; partyCode: string | null; votes: number }>());
  const totalVotes = [...national.values()].reduce((a, c) => a + c.votes, 0);
  return {
    election: { electionId, code: shortCode(election[0]!.code), year: year(election[0]!.code), heldOn: election[0]!.held_on, contestKind: kind },
    contests: kinds.map((k) => ({ kind: k.kind, contests: Number(k.contests) })),
    totals: [...national.values()].sort((a, b) => b.votes - a.votes).map((c) => ({ ...c, share: totalVotes ? c.votes / totalVotes : 0 })),
    units: unitsOut,
    gaps: rows.length === 0 ? ["No results are recorded for this contest and area."] : [],
  };
}

export async function placeElections(db: DataSource, featureId: string) {
  const chain = await crumbs(db, featureId);
  if (chain.length === 0) throw new NotFoundException("No such place.");
  const place = chain[chain.length - 1]!;
  const rows: (ResultRow & { held_on: string; election_code: string; election_id: string; election_kind: string })[] = await db.query(
    `select e.id as election_id, e.code as election_code, e.held_on::text, (select regexp_replace(k.code, '^.*\\.', '') from reference.values k where k.id = e.election_kind_id) as election_kind, c.code as contest_code, ca.code as candidate_code, ca.individual_id, r.votes::float8 as votes,
       ${personName("ca.individual_id")} as candidate,
       (select n.name from official.names n join politics.parties pt on pt.entity_id = n.entity_id where pt.id = ca.party_id_at_election limit 1) as party,
       (select pt.code from politics.parties pt where pt.id = ca.party_id_at_election) as party_code,
       el.registered_voters::float8 as registered, el.ballots_cast::float8 as cast, el.valid_ballots::float8 as valid, el.rejected_ballots::float8 as rejected
     from politics.results r join politics.candidates ca on ca.id = r.candidate_id join politics.contests c on c.id = ca.contest_id join politics.elections e on e.id = c.election_id
     left join politics.electorates el on el.contest_id = c.id and el.unit_feature_id = r.unit_feature_id
     where r.unit_feature_id = $1 order by e.held_on desc, c.code, r.votes desc`, [featureId]);
  const byElection = new Map<string, typeof rows>();
  for (const row of rows) byElection.set(row.election_id, [...(byElection.get(row.election_id) ?? []), row]);
  const elections = [...byElection.values()].map((list) => {
    const byContest = new Map<string, typeof rows>();
    for (const r of list) byContest.set(r.contest_code, [...(byContest.get(r.contest_code) ?? []), r]);
    return {
      electionId: list[0]!.election_id, kind: list[0]!.election_kind, year: year(list[0]!.election_code), heldOn: list[0]!.held_on,
      contests: [...byContest.values()].map((cs) => {
        const total = cs.reduce((a, r) => a + r.votes, 0);
        const first = cs[0]!;
        return {
          kind: shortCode(first.contest_code).split(".")[3] === "mp" ? "member-of-parliament" : shortCode(first.contest_code).split(".")[3] ?? "contest",
          registered: first.registered, ballotsCast: first.cast, turnout: first.registered && first.cast ? first.cast / first.registered : null,
          candidates: cs.map((r, i) => ({ name: r.candidate, party: r.party, partyCode: r.party_code ? shortCode(r.party_code) : null, votes: r.votes, share: total ? r.votes / total : 0, won: i === 0, individualId: r.individual_id })),
        };
      }),
    };
  });
  const trend: { period: string; value: number; estimated: boolean | null }[] = await db.query(
    `select o.period_from::text as period, o.value::float8 as value, o.estimated from statistics.observations o join statistics.indicators i on i.id = o.indicator_id
     where ${hasRole("i", REGISTERED_VOTERS)} and o.feature_id = $1 order by o.period_from`, [featureId]);
  const turnout = elections.flatMap((e) => e.contests.filter((c) => c.turnout !== null).slice(0, 1).map((c) => ({ year: e.year, registered: c.registered, turnout: c.turnout })));
  return {
    place, elections, registrationTrend: trend, turnoutTrend: turnout,
    gaps: elections.length === 0 ? [`No election results are recorded for ${place.name}. County and constituency results are available; ward results are not published in this system.`] : [],
  };
}

export async function listParties(db: DataSource) {
  const rows: { id: string; code: string; name: string; members: string; votes: string | null; seats: string | null; funding: string | null }[] = await db.query(
    `select pt.id, pt.code, ${entityName("pt.entity_id")} as name,
       (select count(distinct m.individual_id) from politics.memberships m where m.party_id = pt.id and m.left_on is null)::text as members,
       (select sum(r.votes) from politics.results r join politics.candidates ca on ca.id = r.candidate_id join politics.contests c on c.id = ca.contest_id and c.code like '%.2022.%' where ca.party_id_at_election = pt.id)::text as votes,
       (select count(*) from governance.holders h join politics.memberships m on m.individual_id = h.individual_id and m.party_id = pt.id and m.left_on is null where h.left_office_on is null)::text as seats,
       (select sum(fl.amount_minor_units) from finance.flows fl where fl.counterparty_entity_id = pt.entity_id)::text as funding
     from politics.parties pt order by 4 desc nulls last`);
  const parties = rows.map((r) => ({ code: shortCode(r.code), name: r.name, members: Number(r.members), votes2022: r.votes ? Number(r.votes) : 0, officeHolders: Number(r.seats ?? 0), fundAllocationKes: r.funding ? Number(r.funding) / 100 : null }));
  parties.sort((a, b) => b.votes2022 - a.votes2022 || b.members - a.members);
  return { parties, gaps: ["Votes are counted from the contests recorded here (2022). Party fund allocations are for the 2026/27 financial year."] };
}

export async function partyDetail(db: DataSource, code: string) {
  const rows: { id: string; code: string; entity_id: string; name: string; registered_on: string | null }[] = await db.query(
    `select pt.id, pt.code, pt.entity_id, ${entityName("pt.entity_id")} as name, pt.registered_on::text from politics.parties pt where pt.code = $1`, [storedCode("pol.par", code)]);
  const party = rows[0];
  if (!party) throw new NotFoundException("No such party.");
  const members: { holder_id: string | null; individual_id: string; name: string; office: string | null; unit: string | null; unit_id: string | null }[] = await db.query(
    `select h.id as holder_id, m.individual_id, ${personName("m.individual_id")} as name,
       (select k.label from governance.offices o join reference.values k on k.id = (select p.title_id from governance.positions p where p.id = o.position_id) where o.id = h.office_id) as office,
       (select ${featureName("o.unit_feature_id", "'en'")} from governance.offices o where o.id = h.office_id) as unit,
       (select o.unit_feature_id from governance.offices o where o.id = h.office_id) as unit_id
     from politics.memberships m left join governance.holders h on h.individual_id = m.individual_id and h.left_office_on is null
     where m.party_id = $1 and m.left_on is null order by (h.id is null), office, unit limit 400`, [party.id]);
  const results: { year: number; contest: string; votes: string; candidates: string; won: string }[] = await db.query(
    `select substring(e.code from '(\\d{4})$')::int as year, regexp_replace(k.code, '^.*\\.', '') as contest, sum(r.votes)::text as votes, count(distinct ca.id)::text as candidates,
       count(distinct ca.id) filter (where r.votes = (select max(r2.votes) from politics.results r2 join politics.candidates ca2 on ca2.id = r2.candidate_id where ca2.contest_id = c.id and r2.unit_feature_id = r.unit_feature_id))::text as won
     from politics.candidates ca join politics.contests c on c.id = ca.contest_id join politics.elections e on e.id = c.election_id join reference.values k on k.id = c.contest_kind_id
     join politics.results r on r.candidate_id = ca.id where ca.party_id_at_election = $1 group by 1, 2 order by 1 desc, 2`, [party.id]);
  const funding: { year: number; amount: string }[] = await db.query(
    `select extract(year from fl.occurred_on)::int as year, sum(fl.amount_minor_units)::text as amount from finance.flows fl where fl.counterparty_entity_id = $1 group by 1 order by 1`, [party.entity_id]);
  const media = await mediaFor(db, "official.entities", [party.entity_id]);
  return {
    party: { code: shortCode(party.code), name: party.name, registeredOn: party.registered_on, media: media.get(party.entity_id) ?? [] },
    members: members.map((m) => ({ holderId: m.holder_id, individualId: m.individual_id, name: m.name, office: m.office, unit: m.unit, unitId: m.unit_id })),
    results: results.map((r) => ({ year: r.year, contest: r.contest, votes: Number(r.votes), candidates: Number(r.candidates), won: Number(r.won) })),
    funding: funding.map((f) => ({ year: f.year, amountKes: Number(f.amount) / 100 })),
    gaps: members.length === 0 ? ["No members are recorded for this party."] : [],
  };
}
void partyOf;
