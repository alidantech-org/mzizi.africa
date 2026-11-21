/**
 * Civic delivery: a place's development fund (allocations by year and class), its projects with locations,
 * infrastructure coverage by area and population, the leadership that oversees it; one project in detail; and tenders.
 */
import { NotFoundException } from "@nestjs/common";
import type { DataSource } from "typeorm";

import { evidenceFor } from "#/modules/locality/features/places/reads/evidence.ts";
import { officialsFor } from "#/modules/locality/features/places/reads/officials.ts";
import { AREA, POPULATION, crumbs, descendantIds, featureName, latestBaseline, mediaFor, money, shortCode, storedCode, entityName } from "./shared.ts";

const word = (code: string | null): string | null => (code === null ? null : code.replace(/^.*\./, ""));

export async function placeCivic(db: DataSource, featureId: string) {
  const chain = await crumbs(db, featureId);
  if (chain.length === 0) throw new NotFoundException("No such place.");
  const place = chain[chain.length - 1]!;
  const ids = await descendantIds(db, featureId);
  const funds: { id: string; code: string; unit_id: string; managing: string | null }[] = await db.query(
    `select f.id, f.code, f.scope_unit_feature_id as unit_id, ${entityName("f.managing_entity_id")} as managing
     from finance.funds f where f.scope_unit_feature_id = any($1::uuid[]) order by f.code`, [ids]);
  const flows: { year: number; class_code: string; label: string; amount: string; n: string }[] = await db.query(
    `select extract(year from fl.occurred_on)::int as year, regexp_replace(c.code, '^.*\\.', '') as class_code, c.label, sum(fl.amount_minor_units)::text as amount, count(*)::text as n
     from finance.flows fl join reference.values c on c.id = fl.expenditure_class_id where fl.scope_unit_feature_id = any($1::uuid[]) group by 1, 2, 3 order by 1 desc, 4 desc`, [ids]);
  const years = new Map<number, { year: number; total: number; classes: { code: string; label: string; amount: number; lines: number }[] }>();
  const classTotals = new Map<string, { code: string; label: string; amount: number }>();
  for (const f of flows) {
    const entry = years.get(f.year) ?? { year: f.year, total: 0, classes: [] };
    entry.total += Number(f.amount) / 100;
    entry.classes.push({ code: f.class_code, label: f.label, amount: Number(f.amount) / 100, lines: Number(f.n) });
    years.set(f.year, entry);
    const t = classTotals.get(f.class_code) ?? { code: f.class_code, label: f.label, amount: 0 };
    t.amount += Number(f.amount) / 100;
    classTotals.set(f.class_code, t);
  }
  const projects: Record<string, unknown>[] = await db.query(
    `select p.id, p.code, p.name, regexp_replace(s.code, '^.*\\.', '') as status, p.started_on::text as started_on, p.completed_on::text as completed_on,
       ${featureName("p.scope_unit_feature_id", "'en'")} as unit, p.scope_unit_feature_id as unit_id,
       case when p.location is null then null else st_asgeojson(p.location)::json end as location,
       (select sum(fl.amount_minor_units)::text from finance.flows fl where fl.project_id = p.id) as amount,
       (select n.name from civic.contracts c join official.names n on n.entity_id = c.contractor_entity_id where c.project_id = p.id order by c.signed_on desc limit 1) as contractor
     from civic.projects p join reference.values s on s.id = p.status_id where p.scope_unit_feature_id = any($1::uuid[]) order by p.started_on desc nulls last, p.code limit 400`, [ids]);
  const area: { v: number | null }[] = await db.query(`select ${latestBaseline(AREA, "$1::uuid")}::float8 as v`, [featureId]);
  const pop: { v: number | null }[] = await db.query(`select ${latestBaseline(POPULATION, "$1::uuid")}::float8 as v`, [featureId]);
  const totalProjects = Number((await db.query("select count(*)::text as n from civic.projects p where p.scope_unit_feature_id = any($1::uuid[])", [ids]))[0].n);
  const completed = projects.filter((p) => p.status === "completed").length;
  const areaKm2 = area[0]?.v ?? null;
  const population = pop[0]?.v ?? null;
  const leadership = await officialsFor(db, chain.map((c) => c.featureId), "en", undefined);
  const mediaMap = await mediaFor(db, "civic.projects", projects.map((p) => String(p.id)), 1);
  const staff = (classTotals.get("salaries")?.amount ?? 0) + (classTotals.get("running-costs")?.amount ?? 0) + (classTotals.get("committee")?.amount ?? 0);
  const all = [...classTotals.values()].reduce((a, c) => a + c.amount, 0);
  const gaps: string[] = [];
  if (funds.length === 0) gaps.push(`No development fund is recorded for ${place.name}. You can ask for this data, or check the fund board's published reports yourself.`);
  if (flows.length > 0 && !flows.some((f) => f.year >= 2024)) gaps.push("The latest allocations recorded are older than two years; newer ones may exist at the official source.");
  if (projects.length === 0) gaps.push(`No projects are recorded for ${place.name}.`);
  if (projects.some((p) => p.location === null)) gaps.push("Some projects have no map location; they are listed but not shown on the map.");
  return {
    place, chain,
    fund: funds[0] ? { code: shortCode(funds[0].code), managedBy: funds[0].managing, funds: funds.length } : null,
    years: [...years.values()].sort((a, b) => b.year - a.year),
    classes: [...classTotals.values()].sort((a, b) => b.amount - a.amount),
    projects: projects.map((p) => ({ ...p, id: undefined, code: shortCode(String(p.code)), amount: money(p.amount as string | null), media: mediaMap.get(String(p.id))?.[0] ?? null })),
    infrastructure: {
      projects: totalProjects, completed, completionRate: totalProjects ? completed / totalProjects : null,
      areaKm2, population,
      perKm2: areaKm2 ? totalProjects / areaKm2 : null, per100k: population ? (totalProjects * 100000) / population : null,
      staffShare: all ? staff / all : null, projectShare: all ? 1 - staff / all - ((classTotals.get("bursary")?.amount ?? 0) + (classTotals.get("emergency")?.amount ?? 0)) / all : null,
    },
    leadership,
    gaps,
  };
}

export async function projectDetail(db: DataSource, code: string) {
  const rows: Record<string, unknown>[] = await db.query(
    `select p.id, p.code, p.name, p.description, regexp_replace(s.code, '^.*\\.', '') as status, p.started_on::text as started_on, p.completed_on::text as completed_on,
       p.scope_unit_feature_id as unit_id, ${featureName("p.scope_unit_feature_id", "'en'")} as unit,
       ${entityName("i.entity_id")} as responsible,
       case when p.location is null then null else st_asgeojson(p.location)::json end as location
     from civic.projects p join reference.values s on s.id = p.status_id left join governance.institutions i on i.id = p.responsible_institution_id where p.code = $1`, [storedCode("civ.prj", code)]);
  const project = rows[0];
  if (!project) throw new NotFoundException("No such project.");
  const id = String(project.id);
  const money_: Record<string, unknown>[] = await db.query(
    `select fl.id, fl.code, regexp_replace(k.code, '^.*\\.', '') as kind, (select c.label from reference.values c where c.id = fl.expenditure_class_id) as class, fl.amount_minor_units::text as amount, fl.occurred_on::text as occurred_on
     from finance.flows fl join reference.values k on k.id = fl.flow_kind_id where fl.project_id = $1 order by fl.occurred_on`, [id]);
  const procurement: Record<string, unknown>[] = await db.query(
    `select pr.id, pr.code, pr.title, pr.reference, regexp_replace(st.code, '^.*\\.', '') as status, regexp_replace(pk.code, '^.*\\.', '') as procedure, pr.published_on::text as published_on, pr.closes_on::text as closes_on, pr.awarded_on::text as awarded_on,
       ${entityName("pr.buyer_entity_id")} as buyer
     from civic.procurements pr left join reference.values st on st.id = pr.status_id join reference.values pk on pk.id = pr.procedure_kind_id where pr.project_id = $1 limit 1`, [id]);
  let detail: unknown = null;
  if (procurement[0]) {
    const pid = String(procurement[0].id);
    const bids: Record<string, unknown>[] = await db.query(
      `select ${entityName("b.bidder_entity_id")} as bidder, b.amount_minor_units::text as amount, regexp_replace(o.code, '^.*\\.', '') as outcome
       from civic.bids b join reference.values o on o.id = b.outcome_id where b.procurement_id = $1 order by b.amount_minor_units`, [pid]);
    const contracts: Record<string, unknown>[] = await db.query(
      `select ${entityName("c.contractor_entity_id")} as contractor, c.amount_minor_units::text as amount, c.signed_on::text as signed_on, regexp_replace(s.code, '^.*\\.', '') as status
       from civic.contracts c join reference.values s on s.id = c.status_id where c.procurement_id = $1`, [pid]);
    detail = { ...procurement[0], id: undefined, code: shortCode(String(procurement[0].code)), bids: bids.map((b) => ({ ...b, amount: money(b.amount as string) })), contracts: contracts.map((c) => ({ ...c, amount: money(c.amount as string) })) };
  }
  const media = await mediaFor(db, "civic.projects", [id], 12);
  const evidence = await evidenceFor(db, "civic.projects", [id]);
  const gaps: string[] = [];
  if (!procurement[0]) gaps.push("No tender or contract is linked to this project. You can ask for it, or check the buyer's procurement page yourself.");
  if (money_.length === 0) gaps.push("No money flow is recorded against this project.");
  if (project.location === null) gaps.push("The exact location of the works is not recorded; only the area is known.");
  return {
    project: { ...project, id: undefined, code: shortCode(String(project.code)) },
    money: money_.map((m) => ({ ...m, id: undefined, code: shortCode(String(m.code)), amount: money(m.amount as string) })),
    procurement: detail,
    media: media.get(id) ?? [],
    evidence: evidence.get(id) ?? [],
    gaps,
  };
}

export async function listTenders(db: DataSource, status: string | undefined, featureId: string | undefined, limit: number, code?: string) {
  const ids = featureId ? await descendantIds(db, featureId) : null;
  const rows: Record<string, unknown>[] = await db.query(
    `select pr.code, coalesce(pr.title, pr.code) as title, pr.reference, regexp_replace(st.code, '^.*\\.', '') as status, regexp_replace(pk.code, '^.*\\.', '') as procedure,
       pr.published_on::text as published_on, pr.closes_on::text as closes_on, pr.awarded_on::text as awarded_on,
       ${entityName("pr.buyer_entity_id")} as buyer,
       (select ${featureName("p.scope_unit_feature_id", "'en'")} from civic.projects p where p.id = pr.project_id) as place,
       (select c.amount_minor_units::text from civic.contracts c where c.procurement_id = pr.id limit 1) as amount,
       (select n.name from civic.contracts c join official.names n on n.entity_id = c.contractor_entity_id where c.procurement_id = pr.id limit 1) as supplier,
       (select count(*) from civic.bids b where b.procurement_id = pr.id)::int as bids,
       (case when pr.published_on is not null then 1 else 0 end + case when pr.closes_on is not null then 1 else 0 end + case when pr.reference is not null then 1 else 0 end
        + case when exists (select 1 from civic.contracts c where c.procurement_id = pr.id) then 1 else 0 end) as disclosed
     from civic.procurements pr left join reference.values st on st.id = pr.status_id join reference.values pk on pk.id = pr.procedure_kind_id
     where ($1::text is null or st.code = 'ref.val.civ.procurement.status.' || $1)
       and ($2::uuid[] is null or exists (select 1 from civic.projects p where p.id = pr.project_id and p.scope_unit_feature_id = any($2::uuid[])))
       and ($4::text is null or pr.code = $4 or pr.code like '%.' || $4)
     order by pr.published_on desc nulls last, pr.code limit $3`, [status ?? null, ids, Math.min(Math.max(limit, 1), 300), code ?? null]);
  const summary: { status: string; n: string; value: string | null }[] = await db.query(
    `select regexp_replace(st.code, '^.*\\.', '') as status, count(*)::text as n, sum((select c.amount_minor_units from civic.contracts c where c.procurement_id = pr.id limit 1))::text as value
     from civic.procurements pr join reference.values st on st.id = pr.status_id group by 1 order by 2 desc`);
  const total = summary.reduce((a, s) => a + Number(s.n), 0);
  return {
    summary: {
      total, byStatus: summary.map((s) => ({ status: s.status, count: Number(s.n), valueKes: s.value ? Number(s.value) / 100 : null })),
      transparency: { withContract: rows.filter((r) => r.supplier !== null).length, listed: rows.length },
    },
    tenders: rows.map((r) => ({ ...r, code: shortCode(String(r.code)), amount: money(r.amount as string | null), disclosed: Number(r.disclosed), disclosedOf: 4 })),
    gaps: [
      "Tender notices come from the public tenders portal. It does not publish awards or contracts through a public data service, so awarded suppliers shown here come from other sources or sample data.",
      "A tender that lacks a published award, amount or closing date is marked; you can ask for it or check the buyer's own notice board.",
    ],
  };
}
void word;
