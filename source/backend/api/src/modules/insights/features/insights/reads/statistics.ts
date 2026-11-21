/**
 * Statistics of a place: topics with the latest figure, history, demographic breakdowns, comparison to its parents,
 * and a heat map of one indicator across the units below a parent. Density is derived (population over area).
 */
import { NotFoundException } from "@nestjs/common";
import type { DataSource } from "typeorm";

import {
  AREA,
  DENSITY,
  POPULATION,
  hasRole,
  hasRoleParam,
  crumbs,
  featureName,
  indicatorShort,
  indicatorStored,
  toleranceFor,
  unitsUnder,
  valueLabel,
} from "./shared.ts";


interface ObsRow {
  code: string;
  name: string;
  higher_is_better: boolean | null;
  topic_code: string;
  topic_label: string;
  unit: string | null;
  measure: string;
  role: string | null;
  period: string;
  value: number;
  estimated: boolean | null;
}

const BASELINE = `o.sex_id is null and o.age_group_id is null and o.residence_id is null and o.ethnicity_id is null and o.language_id is null`;

export type StatisticsScope = "headline" | "topics" | "topic";

/** `scope` sizes the answer: `headline` keeps role figures and breakdowns, `topics` lists topics only, `topic` returns one topic's indicators. */
export async function placeStatistics(db: DataSource, featureId: string, scope?: StatisticsScope, topicCode?: string) {
  const chain = await crumbs(db, featureId);
  if (chain.length === 0) throw new NotFoundException("No such place.");
  const place = chain[chain.length - 1]!;
  const rows: ObsRow[] = await db.query(
    `select i.code, i.name, i.higher_is_better, t.code as topic_code, t.label as topic_label, u.symbol as unit, regexp_replace(mk.code, '^.*\\.', '') as measure, regexp_replace(rl.code, '^.*\\.', '') as role,
       o.period_from::text as period, o.value::float8 as value, o.estimated
     from statistics.observations o
     join statistics.indicators i on i.id = o.indicator_id
     join reference.topics t on t.id = i.topic_id
     left join reference.units u on u.id = i.unit_id
     join reference.values mk on mk.id = i.measure_kind_id
     left join reference.values rl on rl.id = i.role_id
     where o.feature_id = $1 and ${BASELINE} order by i.code, o.period_from`,
    [featureId],
  );
  const byIndicator = new Map<string, ObsRow[]>();
  for (const row of rows) byIndicator.set(row.code, [...(byIndicator.get(row.code) ?? []), row]);
  const topics = new Map<string, { code: string; label: string; indicators: unknown[] }>();
  const ofRole = (roleCode: string): ObsRow[] => rows.filter((r) => r.role === roleCode.replace(/^.*\./, ""));
  const areaRows = ofRole(AREA);
  const area = areaRows.at(-1)?.value ?? null;
  const population = ofRole(POPULATION);
  const addIndicator = (row: ObsRow, series: { period: string; value: number; estimated: boolean | null }[]) => {
    const latest = series[series.length - 1]!;
    const previous = series.length > 1 ? series[series.length - 2]! : null;
    const topic = topics.get(row.topic_code) ?? { code: row.topic_code, label: row.topic_label, indicators: [] };
    topic.indicators.push({
      code: indicatorShort(row.code), name: row.name, unit: row.unit, measure: row.measure, role: row.role, higherIsBetter: row.higher_is_better,
      latest, previous, change: previous === null || previous.value === 0 ? null : (latest.value - previous.value) / previous.value, series,
    });
    topics.set(row.topic_code, topic);
  };
  for (const [code, list] of byIndicator) {
    const sample = list[0]!;
    if (sample.role === areaRows[0]?.role) continue;
    addIndicator(sample, list.map((r) => ({ period: r.period, value: r.value, estimated: r.estimated })));
  }
  if (area !== null && population.length > 0) {
    addIndicator(
      { ...population[0]!, code: DENSITY, name: "Population density", unit: `per ${areaRows[0]?.unit ?? "area"}`, measure: "density", role: "density", topic_code: population[0]!.topic_code, topic_label: population[0]!.topic_label, higher_is_better: null },
      population.map((r) => ({ period: r.period, value: r.value / area, estimated: true })),
    );
  }
  if (area !== null) {
    addIndicator({ ...areaRows[0]! }, areaRows.map((r) => ({ period: r.period, value: r.value, estimated: r.estimated })));
  }
  const lean = scope === "topics" || scope === "topic";
  if (lean) {
    const all = [...topics.values()].sort((a, b) => a.label.localeCompare(b.label));
    const shown = all.map((t) => ({ ...t, indicators: scope === "topic" && t.code === topicCode ? t.indicators : [] }));
    return { place, chain, topics: shown, breakdowns: {}, comparisons: [], siblings: { population: null, density: null, peers: 0 }, gaps: [] };
  }
  const breakdowns = await breakdownsOf(db, featureId);
  if (scope === "headline") {
    for (const t of topics.values()) t.indicators = (t.indicators as { role: string | null }[]).filter((i) => i.role);
    for (const [code, t] of [...topics]) if (!t.indicators.length) topics.delete(code);
  }
  const comparisons: unknown[] = [];
  for (const unit of chain) {
    const figures: { pop: number | null; area: number | null }[] = await db.query(
      `select (select o.value::float8 from statistics.observations o join statistics.indicators i on i.id = o.indicator_id where ${hasRoleParam('i', 2)} and o.feature_id = $1 and ${BASELINE} order by o.period_from desc limit 1) as pop,
              (select o.value::float8 from statistics.observations o join statistics.indicators i on i.id = o.indicator_id where ${hasRoleParam('i', 3)} and o.feature_id = $1 and ${BASELINE} order by o.period_from desc limit 1) as area`,
      [unit.featureId, POPULATION, AREA],
    );
    const f = figures[0]!;
    comparisons.push({ place: unit, population: f.pop, areaKm2: f.area, density: f.pop !== null && f.area ? f.pop / f.area : null });
  }
  const siblings = await rankAmongSiblings(db, featureId);
  const expected = [
    ["ref.top.topic.population", "population"], ["ref.top.topic.health", "health"], ["ref.top.topic.education", "education"],
    ["ref.top.topic.economy", "poverty and the economy"], ["ref.top.topic.water", "water and sanitation"], ["ref.top.topic.transparency", "transparency and audit"],
  ] as const;
  const have = new Set(topics.keys());
  const gaps = expected
    .filter(([code]) => !have.has(code))
    .map(([, label]) => `No ${label} statistics are recorded for ${place.name}. You can ask for them, or check the Kenya National Bureau of Statistics county abstracts yourself.`);
  const ordered = [...topics.values()].sort((a, b) => a.label.localeCompare(b.label));
  return { place, chain, topics: ordered, breakdowns, comparisons, siblings, gaps };
}

async function rankAmongSiblings(db: DataSource, featureId: string) {
  const rows: { id: string; name: string; pop: number | null; area: number | null }[] = await db.query(
    `with parent as (select r.object_feature_id as pid from geography.relationships r where r.subject_feature_id = $1 and r.to_year is null limit 1)
     select s.subject_feature_id as id, ${featureName("s.subject_feature_id", "'en'")} as name,
       (select o.value::float8 from statistics.observations o join statistics.indicators i on i.id = o.indicator_id where ${hasRoleParam('i', 2)} and o.feature_id = s.subject_feature_id and ${BASELINE} order by o.period_from desc limit 1) as pop,
       (select o.value::float8 from statistics.observations o join statistics.indicators i on i.id = o.indicator_id where ${hasRoleParam('i', 3)} and o.feature_id = s.subject_feature_id and ${BASELINE} order by o.period_from desc limit 1) as area
     from geography.relationships s join parent on s.object_feature_id = parent.pid where s.to_year is null`,
    [featureId, POPULATION, AREA],
  );
  const withPop = rows.filter((r) => r.pop !== null);
  const byPop = [...withPop].sort((a, b) => b.pop! - a.pop!);
  const byDensity = withPop.filter((r) => r.area).sort((a, b) => b.pop! / b.area! - a.pop! / a.area!);
  const rank = (list: { id: string }[]) => {
    const i = list.findIndex((r) => r.id === featureId);
    return i < 0 ? null : { position: i + 1, of: list.length };
  };
  return { population: rank(byPop), density: rank(byDensity), peers: rows.length };
}

interface DimRow { dim: string; ind: string; label: string; value: number; period: string }

async function breakdownsOf(db: DataSource, featureId: string) {
  const rows: DimRow[] = await db.query(
    `select d.dim, d.ind, d.label, d.value, d.period from (
       select 'sex' as dim, o.indicator_id as ind, ${valueLabel("o.sex_id", "'en'")} as label, o.value::float8 as value, o.period_from::text as period from statistics.observations o where o.feature_id = $1 and o.sex_id is not null
       union all select 'age', o.indicator_id, ${valueLabel("o.age_group_id", "'en'")}, o.value::float8, o.period_from::text from statistics.observations o where o.feature_id = $1 and o.age_group_id is not null
       union all select 'residence', o.indicator_id, ${valueLabel("o.residence_id", "'en'")}, o.value::float8, o.period_from::text from statistics.observations o where o.feature_id = $1 and o.residence_id is not null
       union all select 'community', o.indicator_id, ${valueLabel("o.ethnicity_id", "'en'")}, o.value::float8, o.period_from::text from statistics.observations o where o.feature_id = $1 and o.ethnicity_id is not null
       union all select 'language', o.indicator_id, (select l.name from reference.languages l where l.id = o.language_id), o.value::float8, o.period_from::text from statistics.observations o where o.feature_id = $1 and o.language_id is not null) d
     order by d.dim, d.value desc`,
    [featureId],
  );
  // One dimension can be recorded by several indicators and years: keep the indicator with the most categories, at its latest year.
  const best = new Map<string, { ind: string; period: string; n: number }>();
  const tally = new Map<string, number>();
  for (const r of rows) {
    const k = `${r.dim}|${r.ind}|${r.period}`;
    tally.set(k, (tally.get(k) ?? 0) + 1);
  }
  for (const [k, n] of tally) {
    const [dim, ind, period] = k.split("|") as [string, string, string];
    const cur = best.get(dim);
    if (!cur || n > cur.n || (n === cur.n && period > cur.period)) best.set(dim, { ind, period, n });
  }
  const groups: Record<string, { label: string; value: number; share: number }[]> = {};
  for (const row of rows.filter((r) => best.get(r.dim)?.ind === r.ind && best.get(r.dim)?.period === r.period)) (groups[row.dim] ??= []).push({ label: row.label, value: row.value, share: 0 });
  for (const [dim, list] of Object.entries(groups)) {
    const total = dim === "language" ? 0 : list.reduce((a, b) => a + b.value, 0);
    for (const item of list) item.share = total > 0 ? item.value / total : 0;
  }
  if (groups.age) {
    groups.age.sort((a, b) => Number.parseInt(a.label, 10) - Number.parseInt(b.label, 10));
  }
  return groups;
}

export async function indicatorSeries(db: DataSource, code: string, featureId: string) {
  const chain = await crumbs(db, featureId);
  if (chain.length === 0) throw new NotFoundException("No such place.");
  const place = chain[chain.length - 1]!;
  if (code === DENSITY) {
    const pop: { period: string; value: number; estimated: boolean | null }[] = await db.query(
      `select o.period_from::text as period, o.value::float8 as value, o.estimated from statistics.observations o join statistics.indicators i on i.id = o.indicator_id where ${hasRoleParam('i', 2)} and o.feature_id = $1 and ${BASELINE} order by o.period_from`,
      [featureId, POPULATION],
    );
    const area: { v: number }[] = await db.query(
      `select o.value::float8 as v from statistics.observations o join statistics.indicators i on i.id = o.indicator_id where ${hasRoleParam('i', 2)} and o.feature_id = $1 order by o.period_from desc limit 1`,
      [featureId, AREA],
    );
    const a = area[0]?.v;
    return {
      indicator: { code, name: "Population density", unit: "per km²", description: "People per square kilometre, from population and area." },
      place, points: a ? pop.map((p) => ({ ...p, value: p.value / a })) : [],
      gaps: a ? [] : [`The area of ${place.name} is not recorded, so density cannot be shown.`],
    };
  }
  const meta: { code: string; name: string; description: string; unit: string | null; higher_is_better: boolean | null }[] = await db.query(
    "select i.code, i.name, i.description, u.symbol as unit, i.higher_is_better from statistics.indicators i left join reference.units u on u.id = i.unit_id where i.code = $1",
    [indicatorStored(code)],
  );
  if (meta.length === 0) throw new NotFoundException("No such indicator.");
  const points: unknown[] = await db.query(
    `select o.period_from::text as period, o.value::float8 as value, o.estimated from statistics.observations o join statistics.indicators i on i.id = o.indicator_id
     where i.code = $2 and o.feature_id = $1 and ${BASELINE} order by o.period_from`,
    [featureId, indicatorStored(code)],
  );
  const m = meta[0]!;
  return {
    indicator: { code: indicatorShort(m.code), name: m.name, unit: m.unit, description: m.description, higherIsBetter: m.higher_is_better },
    place, points,
    gaps: points.length === 0 ? [`${m.name} is not recorded for ${place.name}.`] : [],
  };
}

interface MapRow { id: string; name: string; kind: string; value: number | null; geometry: unknown; estimated: boolean | null }

export async function indicatorMap(db: DataSource, code: string, parentId: string | undefined, kind: string | undefined) {
  const units = await unitsUnder(db, parentId, kind);
  const parent = parentId ? (await crumbs(db, parentId)).at(-1) ?? null : null;
  if (units.length === 0) return { indicator: { code }, parent, periodFrom: null, units: [], gaps: ["No units are recorded under this place."] };
  const tolerance = toleranceFor(units[0]!.kind);
  const derived = code === DENSITY;
  const toleranceParam = derived ? "$2" : "$3";
  const rows: MapRow[] = await db.query(
    `select f.id, ${featureName("f.id", "'en'")} as name, regexp_replace(k.code, '^.*\\.', '') as kind,
       ${derived
         ? `(select o.value::float8 from statistics.observations o join statistics.indicators i on i.id = o.indicator_id where ${hasRole('i', POPULATION)} and o.feature_id = f.id and ${BASELINE} order by o.period_from desc limit 1)
            / nullif((select o.value::float8 from statistics.observations o join statistics.indicators i on i.id = o.indicator_id where ${hasRole('i', AREA)} and o.feature_id = f.id order by o.period_from desc limit 1), 0)`
         : `(select o.value::float8 from statistics.observations o join statistics.indicators i on i.id = o.indicator_id where ${hasRoleParam('i', 2)} and o.feature_id = f.id and ${BASELINE} order by o.period_from desc limit 1)`} as value,
       (select o.estimated from statistics.observations o join statistics.indicators i on i.id = o.indicator_id where ${hasRole('i', POPULATION)} and o.feature_id = f.id order by o.period_from desc limit 1) as estimated,
       (select st_asgeojson(st_simplifypreservetopology(g.geometry, ${toleranceParam}), 4)::json from geography.geometries g
          join reference.values gr on gr.id = g.geometry_role_id and gr.code in ('ref.val.geo.geometry.role.outline', 'ref.val.geo.geometry.role.label-point')
          where g.feature_id = f.id and g.to_year is null order by gr.code limit 1) as geometry
     from geography.features f join reference.values k on k.id = f.feature_type_id where f.id = any($1::uuid[])`,
    derived ? [units.map((u) => u.id), tolerance] : [units.map((u) => u.id), indicatorStored(code), tolerance],
  );
  const meta: { name: string; unit: string | null; higher_is_better: boolean | null }[] = derived
    ? [{ name: "Population density", unit: "per km²", higher_is_better: null }]
    : await db.query("select i.name, u.symbol as unit, i.higher_is_better from statistics.indicators i left join reference.units u on u.id = i.unit_id where i.code = $1", [indicatorStored(code)]);
  if (meta.length === 0) throw new NotFoundException("No such indicator.");
  const ranked = [...rows].filter((r) => r.value !== null).sort((a, b) => b.value! - a.value!);
  const rankOf = new Map(ranked.map((r, i) => [r.id, i + 1]));
  const gaps = rows.some((r) => r.value === null) ? [`${rows.filter((r) => r.value === null).length} of ${rows.length} units have no figure for this indicator.`] : [];
  return {
    indicator: { code, name: meta[0]!.name, unit: meta[0]!.unit, higherIsBetter: meta[0]!.higher_is_better },
    parent, periodFrom: null,
    units: rows.map((r) => ({ featureId: r.id, name: r.name, kind: r.kind, value: r.value, rank: rankOf.get(r.id) ?? null, estimated: r.estimated, geometry: r.geometry })).sort((a, b) => (a.rank ?? 1e9) - (b.rank ?? 1e9)),
    gaps,
  };
}
