/**
 * Leaderboards: places (or leaders) ranked by one metric, grouped by domain (statistics, finance, civic delivery,
 * elections, legislative activity). Each metric is a query over the stored tables; adding one is adding an entry.
 */
import { NotFoundException } from "@nestjs/common";
import type { DataSource } from "typeorm";

import {
  AREA,
  DENSITY,
  POPULATION,
  REGISTERED_VOTERS,
  hasRole,
  crumbs,
  featureName,
  indicatorShort,
  indicatorStored,
  latestBaseline,
  personName,
  partyOf,
  unitsUnder,
} from "./shared.ts";

interface Metric {
  code: string;
  title: string;
  domain: string;
  unit: string | null;
  higherIsBetter: boolean;
  describe: string;
  /** "place" metrics rank units; "leader" metrics rank office holders. */
  subject: "place" | "leader";
  /** SQL selecting (feature_id, value, detail) for the units in `$1::uuid[]`. */
  sql: string;
}

const PROJECT_CLASSES = ["education-infrastructure", "roads-and-drainage", "health-infrastructure", "security-and-administration", "other-projects"]
  .map((c) => `'ref.val.fin.expenditure.class.${c}'`).join(",");
const STAFF_CLASSES = ["salaries", "running-costs", "committee"].map((c) => `'ref.val.fin.expenditure.class.${c}'`).join(",");

/** Sum of allocation flows scoped to the unit in a set of classes. */
const allocated = (classes: string | null) => `(select coalesce(sum(fl.amount_minor_units), 0)::float8 / 100 from finance.flows fl
  ${classes ? `join reference.values c on c.id = fl.expenditure_class_id and c.code in (${classes})` : ""}
  where fl.scope_unit_feature_id = f.id and fl.flow_kind_id is not null)`;

const projectCount = (extra = "") => `(select count(*) from civic.projects p where p.scope_unit_feature_id = f.id ${extra})::float8`;

const METRICS: Metric[] = [
  { code: DENSITY, title: "Population density", domain: "statistics", unit: "per km²", higherIsBetter: true, subject: "place", describe: "People per square kilometre.",
    sql: `select f.id, ${latestBaseline(POPULATION, "f.id")}::float8 / nullif((select o.value::float8 from statistics.observations o join statistics.indicators i on i.id = o.indicator_id where ${hasRole("i", AREA)} and o.feature_id = f.id order by o.period_from desc limit 1), 0) as value, null as detail from geography.features f where f.id = any($1::uuid[])` },
  { code: "civ.projects.per-100k", title: "Public projects per 100,000 people", domain: "civic", unit: "per 100,000", higherIsBetter: true, subject: "place", describe: "Recorded public projects scoped to the unit, for every 100,000 residents.",
    sql: `select f.id, ${projectCount()} * 100000 / nullif(${latestBaseline(POPULATION, "f.id")}, 0) as value, null as detail from geography.features f where f.id = any($1::uuid[])` },
  { code: "civ.projects.per-1000km2", title: "Public projects per 1,000 km²", domain: "civic", unit: "per 1,000 km²", higherIsBetter: true, subject: "place", describe: "Recorded public projects for every 1,000 square kilometres: how thickly infrastructure covers the land.",
    sql: `select f.id, ${projectCount()} * 1000 / nullif((select o.value::float8 from statistics.observations o join statistics.indicators i on i.id = o.indicator_id where ${hasRole("i", AREA)} and o.feature_id = f.id order by o.period_from desc limit 1), 0) as value, null as detail from geography.features f where f.id = any($1::uuid[])` },
  { code: "civ.projects.completion-rate", title: "Project completion rate", domain: "civic", unit: "%", higherIsBetter: true, subject: "place", describe: "Share of the unit's projects that are completed.",
    sql: `select f.id, 100 * ${projectCount("and exists (select 1 from reference.values s where s.id = p.status_id and s.code like '%.completed')")} / nullif(${projectCount()}, 0) as value, ${projectCount()}::int::text || ' projects' as detail from geography.features f where f.id = any($1::uuid[])` },
  { code: "fin.ngcdf.per-capita", title: "Development fund allocation per person", domain: "finance", unit: "KSh", higherIsBetter: true, subject: "place", describe: "Constituency development fund allocated for each resident (all years recorded).",
    sql: `select f.id, ${allocated(null)} / nullif(${latestBaseline(POPULATION, "f.id")}, 0) as value, null as detail from geography.features f where f.id = any($1::uuid[])` },
  { code: "fin.ngcdf.project-share", title: "Share of the fund that goes to projects", domain: "finance", unit: "%", higherIsBetter: true, subject: "place", describe: "Of every shilling the fund allocated, how much went to infrastructure projects rather than staff, running and committee costs.",
    sql: `select f.id, 100 * ${allocated(PROJECT_CLASSES)} / nullif(${allocated(null)}, 0) as value, null as detail from geography.features f where f.id = any($1::uuid[])` },
  { code: "fin.ngcdf.staff-share", title: "Share of the fund spent on staff and running costs", domain: "finance", unit: "%", higherIsBetter: false, subject: "place", describe: "Salaries, running costs and committee costs as a share of all allocations. Lower leaves more for projects.",
    sql: `select f.id, 100 * ${allocated(STAFF_CLASSES)} / nullif(${allocated(null)}, 0) as value, null as detail from geography.features f where f.id = any($1::uuid[])` },
  { code: "ele.turnout-2022", title: "Voter turnout, 2022", domain: "elections", unit: "%", higherIsBetter: true, subject: "place", describe: "Ballots cast as a share of registered voters in the 2022 general election (county governor or constituency member contest).",
    sql: `select f.id, 100 * e.ballots_cast::float8 / nullif(e.registered_voters, 0) as value, e.registered_voters::text || ' registered' as detail
          from geography.features f join politics.electorates e on e.unit_feature_id = f.id join politics.contests c on c.id = e.contest_id
          where f.id = any($1::uuid[]) and (c.code like '%.2022.governor.%' or c.code like '%.2022.mp.%')` },
  { code: "ele.registration-growth", title: "Growth in registered voters, 2013 to 2022", domain: "elections", unit: "%", higherIsBetter: true, subject: "place", describe: "How much the voters' register grew between the 2013 and 2022 general elections.",
    sql: `select f.id, 100 * (b.value / nullif(a.value, 0) - 1) as value, null as detail from geography.features f
          join lateral (select o.value::float8 as value from statistics.observations o join statistics.indicators i on i.id = o.indicator_id where ${hasRole("i", REGISTERED_VOTERS)} and o.feature_id = f.id and o.period_from = '2013-08-01') a on true
          join lateral (select o.value::float8 as value from statistics.observations o join statistics.indicators i on i.id = o.indicator_id where ${hasRole("i", REGISTERED_VOTERS)} and o.feature_id = f.id and o.period_from = '2022-08-01') b on true
          where f.id = any($1::uuid[])` },
  { code: "civ.tenders.open", title: "Open tenders", domain: "civic", unit: "tenders", higherIsBetter: true, subject: "place", describe: "Tenders currently open for projects in the unit.",
    sql: `select f.id, (select count(*) from civic.procurements pr join civic.projects p on p.id = pr.project_id join reference.values s on s.id = pr.status_id and s.code like '%.open' where p.scope_unit_feature_id = f.id)::float8 as value, null as detail from geography.features f where f.id = any($1::uuid[])` },
  { code: "act.attendance", title: "Attendance at votes", domain: "activity", unit: "%", higherIsBetter: true, subject: "leader", describe: "Share of recorded divisions the member took part in (voted yes, no or abstained) rather than being absent.",
    sql: `select h.id, 100 * count(*) filter (where p.code not like '%.absent')::float8 / count(*) as value,
            ${personName("h.individual_id")} || ' · ' || coalesce(${partyOf("h.individual_id")}, 'no party') as detail
          from governance.holders h join governance.votes v on v.holder_id = h.id join reference.values p on p.id = v.position_id group by h.id, h.individual_id having count(*) >= 3` },
  { code: "act.yes-rate", title: "Share of votes in favour", domain: "activity", unit: "%", higherIsBetter: true, subject: "leader", describe: "Of the votes a member cast, how many were in favour.",
    sql: `select h.id, 100 * count(*) filter (where p.code like '%.yes')::float8 / nullif(count(*) filter (where p.code not like '%.absent'), 0) as value,
            ${personName("h.individual_id")} || ' · ' || coalesce(${partyOf("h.individual_id")}, 'no party') as detail
          from governance.holders h join governance.votes v on v.holder_id = h.id join reference.values p on p.id = v.position_id group by h.id, h.individual_id having count(*) >= 3` },
];

export function listMetrics(statisticMetrics: { code: string; name: string; unit: string | null; higher_is_better: boolean | null; description: string; role: string | null }[]) {
  const built = METRICS.map(({ sql: _sql, subject: _subject, ...rest }) => rest);
  const stats = statisticMetrics.map((m) => ({
    code: indicatorShort(m.code), title: m.name, domain: "statistics", unit: m.unit, higherIsBetter: m.higher_is_better ?? true, describe: m.description, role: m.role,
  }));
  return [...stats, ...built];
}

export async function leaderboardMetrics(db: DataSource) {
  const rows = await db.query(
    `select i.code, i.name, u.symbol as unit, i.higher_is_better, i.description, regexp_replace(rl.code, '^.*\\.', '') as role
       from statistics.indicators i left join reference.units u on u.id = i.unit_id left join reference.values rl on rl.id = i.role_id
      where not ${hasRole("i", AREA)}
        and not exists (select 1 from statistics.observations o where o.indicator_id = i.id and o.language_id is not null)
      order by i.name`,
    [],
  );
  return { metrics: listMetrics(rows) };
}

export async function leaderboard(db: DataSource, metricCode: string, kind: string | undefined, parentId: string | undefined, limit: number) {
  const builtin = METRICS.find((m) => m.code === metricCode);
  const stat = builtin ? null : (await db.query(
    "select i.code, i.name, u.symbol as unit, i.higher_is_better, i.description from statistics.indicators i left join reference.units u on u.id = i.unit_id where i.code = $1",
    [indicatorStored(metricCode)],
  ))[0];
  if (!builtin && !stat) throw new NotFoundException("No such metric.");
  const metric = builtin
    ? { code: builtin.code, title: builtin.title, domain: builtin.domain, unit: builtin.unit, higherIsBetter: builtin.higherIsBetter, describe: builtin.describe }
    : { code: metricCode, title: stat.name as string, domain: "statistics", unit: stat.unit as string | null, higherIsBetter: (stat.higher_is_better as boolean | null) ?? true, describe: stat.description as string };
  const gaps: string[] = [];
  const scopeCrumb = parentId ? (await crumbs(db, parentId)).at(-1) : null;
  const level = kind ?? (parentId ? undefined : "county");
  let rows: { id: string; value: number | null; detail: string | null }[];
  let names: Map<string, string> = new Map();
  if (builtin?.subject === "leader") {
    rows = await db.query(builtin.sql);
    const people: { id: string; name: string }[] = await db.query(
      `select h.id, ${personName("h.individual_id")} as name from governance.holders h where h.id = any($1::uuid[])`, [rows.map((r) => r.id)]);
    names = new Map(people.map((p) => [p.id, p.name]));
  } else {
    const units = await unitsUnder(db, parentId, level);
    const ids = units.map((u) => u.id);
    if (builtin) {
      rows = await db.query(builtin.sql, [ids]);
    } else {
      rows = await db.query(
        `select f.id, ${latestBaseline(indicatorStored(metricCode), "f.id")}::float8 as value, null as detail from geography.features f where f.id = any($1::uuid[])`, [ids]);
    }
    const nm: { id: string; name: string }[] = await db.query(`select f.id, ${featureName("f.id", "'en'")} as name from geography.features f where f.id = any($1::uuid[])`, [ids]);
    names = new Map(nm.map((n) => [n.id, n.name]));
  }
  const withValue = rows.filter((r) => r.value !== null && Number.isFinite(Number(r.value)));
  if (withValue.length < rows.length) gaps.push(`${rows.length - withValue.length} of ${rows.length} units have no data for this metric and are left out of the ranking.`);
  withValue.sort((a, b) => (metric.higherIsBetter ? Number(b.value) - Number(a.value) : Number(a.value) - Number(b.value)));
  const top = withValue.slice(0, Math.min(Math.max(limit, 1), 500));
  const total = top.reduce((a, r) => a + Number(r.value), 0);
  return {
    metric,
    scope: `${level ?? "units"}${scopeCrumb ? ` in ${scopeCrumb.name}` : " nationwide"}`,
    rows: top.map((r, i) => ({
      rank: i + 1, featureId: builtin?.subject === "leader" ? null : r.id, subjectId: builtin?.subject === "leader" ? r.id : null,
      name: names.get(r.id) ?? r.id, detail: r.detail, value: Number(r.value), share: total > 0 ? Number(r.value) / total : null,
    })),
    gaps,
  };
}


/** The value of one metric for specific places, and how the metric is described; used to compare places side by side. */
export async function metricValues(db: DataSource, metricCode: string, ids: string[]) {
  const builtin = METRICS.find((m) => m.code === metricCode);
  if (builtin && builtin.subject === "leader") return null;
  const stat = builtin ? null : (await db.query(
    "select i.code, i.name, u.symbol as unit, i.higher_is_better from statistics.indicators i left join reference.units u on u.id = i.unit_id where i.code = $1",
    [indicatorStored(metricCode)],
  ))[0];
  if (!builtin && !stat) return null;
  const rows: { id: string; value: number | null }[] = builtin
    ? await db.query(builtin.sql, [ids])
    : await db.query(`select f.id, ${latestBaseline(indicatorStored(metricCode), "f.id")}::float8 as value from geography.features f where f.id = any($1::uuid[])`, [ids]);
  return {
    title: builtin ? builtin.title : (stat.name as string), unit: builtin ? builtin.unit : (stat.unit as string | null),
    higherIsBetter: builtin ? builtin.higherIsBetter : ((stat.higher_is_better as boolean | null) ?? true),
    values: new Map(rows.map((r) => [r.id, r.value === null ? null : Number(r.value)])),
  };
}
