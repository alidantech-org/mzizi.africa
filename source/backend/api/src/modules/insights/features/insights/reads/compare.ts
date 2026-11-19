/** Places to compare with: the closest by geography, the top performers, and the ladder of the units above a place. */
import type { DataSource } from "typeorm";

import { crumbs, lastWord, type Crumb } from "./shared.ts";
import { leaderboard, leaderboardMetrics, metricValues } from "./leaderboards.ts";
import { featureName, valueLabel } from "#/modules/locality/features/places/reads/language.ts";
import { DENSITY } from "./shared.ts";

/** The metrics worth comparing at a glance: every non-statistical metric, the population (by role) and the derived density. */
const headline = (m: { domain: string; code: string; role?: string | null }): boolean => m.domain !== "statistics" || m.code === DENSITY || m.role === "population";

async function place(db: DataSource, id: string) {
  const rows: { id: string; name: string; kind: string; label: string }[] = await db.query(
    `select f.id, ${featureName("f.id", "'en'")} as name, k.code as kind, ${valueLabel("k.id", "'en'")} as label from geography.features f join reference.values k on k.id = f.feature_type_id where f.id = $1`, [id]);
  return rows[0] ? { featureId: rows[0].id, name: rows[0].name, kindCode: rows[0].kind, kindLabel: rows[0].label } : null;
}

export async function compareOptions(db: DataSource, featureId: string, metric?: string) {
  const here = await place(db, featureId);
  const gaps: string[] = [];
  if (!here) return { place: {}, nearby: [], top: [], hierarchy: [], metrics: [], gaps: ["That place is not known."] };
  const kind = lastWord(here.kindCode);
  const ladder = await crumbs(db, featureId);
  const country = ladder[0];
  const nearby: { id: string; name: string; km: number }[] = await db.query(
    `with me as (select g.centroid from geography.geometries g join reference.values gr on gr.id = g.geometry_role_id and gr.code = 'ref.val.geo.geometry.role.outline' where g.feature_id = $1 and g.to_year is null limit 1)
     select f.id, ${featureName("f.id", "'en'")} as name, st_distance(g.centroid::geography, me.centroid::geography) / 1000 as km
     from geography.features f join reference.values k on k.id = f.feature_type_id and k.id = (select feature_type_id from geography.features where id = $1)
       join geography.geometries g on g.feature_id = f.id and g.to_year is null join reference.values gr on gr.id = g.geometry_role_id and gr.code = 'ref.val.geo.geometry.role.outline', me
     where f.id <> $1 order by st_distance(g.centroid::geography, me.centroid::geography), f.id limit 10`, [featureId]);
  if (nearby.length === 0) gaps.push("The map outline of this place is not recorded, so nearby places cannot be found.");
  const code = metric ?? (await leaderboardMetrics(db)).metrics.find((m) => m.domain === "civic")?.code ?? "";
  let top: Awaited<ReturnType<typeof leaderboard>>["rows"] = [];
  try {
    const board = await leaderboard(db, code, kind, undefined, 10);
    top = board.rows;
    if (top.length === 0) gaps.push("No comparable places have recorded data for this figure.");
  } catch {
    gaps.push("That figure cannot rank places of this kind.");
  }
  const rungs: { code: string; label: string; kind: string | null }[] = await db.query(
    `select v.code, ${valueLabel("v.id", "'en'")} as label,
       (select t.code from reference.value_relations vr join reference.values t on t.id = vr.target_value_id
          where vr.source_value_id = v.id and vr.relation_kind = 'related_to' limit 1) as kind
     from reference.values v join reference.schemes s on s.id = v.scheme_id
     where s.code = 'ref.sch.gov.level' and v.deleted_at is null order by v.position desc nulls last, v.code`);
  const hierarchy: { rung: string; label: string; available: boolean; unit: Crumb | null; message: string | null }[] = rungs.map((r) => {
    const unit = ladder.find((c) => c.kindCode === r.kind);
    return { rung: lastWord(r.code), label: r.label, available: unit !== undefined, unit: unit ?? null,
      message: unit ? null : `No ${r.label.toLowerCase()} is recorded in this place's hierarchy.` };
  });
  const countries: { id: string; name: string }[] = await db.query(
    `select f.id, ${featureName("f.id", "'en'")} as name from geography.features f join reference.values k on k.id = f.feature_type_id where k.code like '%.country'`);
  hierarchy.push({
    rung: "world", label: "Other countries", available: countries.length > 1,
    unit: null, message: countries.length > 1 ? null : `Only ${country?.name ?? "one country"} is recorded here. Other countries will appear when their data is added.`,
  });
  const metrics = (await leaderboardMetrics(db)).metrics.filter(headline).filter((m) => m.domain !== "activity");
  return { place: here, nearby: nearby.map((n) => ({ featureId: n.id, name: n.name, kindLabel: here.kindLabel, distanceKm: Math.round(Number(n.km) * 10) / 10 })), top, hierarchy, metrics, gaps };
}

export async function comparison(db: DataSource, a: string, b: string, metricsParam?: string) {
  const [pa, pb] = await Promise.all([place(db, a), place(db, b)]);
  const gaps: string[] = [];
  const codes = (metricsParam ? metricsParam.split(",").map((m) => m.trim()).filter(Boolean) : (await leaderboardMetrics(db)).metrics.filter(headline).filter((m) => m.domain !== "activity").map((m) => m.code)).slice(0, 12);
  const rows: { code: string; title: string; unit: string | null; higherIsBetter: boolean; a: number | null; b: number | null; diffPercent: number | null }[] = [];
  for (const code of codes) {
    const result = await metricValues(db, code, [a, b]);
    if (!result) continue;
    const va = result.values.get(a) ?? null;
    const vb = result.values.get(b) ?? null;
    const diff = va !== null && vb !== null && vb !== 0 ? ((va - vb) / Math.abs(vb)) * 100 : null;
    rows.push({ code, title: result.title, unit: result.unit, higherIsBetter: result.higherIsBetter, a: va, b: vb, diffPercent: diff === null ? null : Math.round(diff * 10) / 10 });
  }
  if (!pa || !pb) gaps.push("One of the places is not known.");
  if (rows.every((r) => r.a === null || r.b === null)) gaps.push("There are no figures recorded for both places.");
  return { a: pa ?? {}, b: pb ?? {}, rows, gaps };
}
