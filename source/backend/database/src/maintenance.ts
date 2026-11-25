/**
 * Named maintenance operations on the live database (FOUNDATION_REDESIGN sections 18, 20 and 29.2). They change data or
 * add partitions of declared layouts; they never change the declared schema, so the release stream stays one baseline.
 *
 * - `partitions`: creates the monthly partitions of every month-partitioned table up to a target month.
 * - `refresh`: rebuilds the prepared tables: map outlines per zoom band, "where am I?" pieces and the figures to show.
 */
import type { SQL } from "bun";

/** Zoom bands of prepared outlines and their simplification tolerance in degrees. */
export const OUTLINE_BANDS: readonly { readonly band: number; readonly tolerance: number }[] = [
  { band: 0, tolerance: 0.05 },
  { band: 1, tolerance: 0.01 },
  { band: 2, tolerance: 0.002 },
  { band: 3, tolerance: 0.0005 },
];
/** Coordinates are rounded to 5 decimals (about 1 m), what a screen needs. */
export const OUTLINE_GRID = 0.00001;
/** Largest number of vertices in one subdivided piece. */
export const PIECE_VERTICES = 256;
/** How far ahead monthly partitions are created by default. */
export const MONTHS_AHEAD = 12;

export type RefreshTarget = "outlines" | "pieces" | "figures";
export const REFRESH_TARGETS: readonly RefreshTarget[] = ["outlines", "pieces", "figures"];

function bandValues(): string {
  return OUTLINE_BANDS.map(({ band, tolerance }) => `(${band}, ${tolerance})`).join(", ");
}

const REFRESH_SQL: Record<RefreshTarget, () => string> = {
  outlines: () => `
    DELETE FROM geography.outlines;
    INSERT INTO geography.outlines (id, created_at, feature_id, geometry_id, band, tolerance, geometry, bbox, centroid, points, built_at)
    SELECT gen_random_uuid(), now(), g.feature_id, g.id, b.band, b.tolerance, s.geom,
           ST_Envelope(g.geometry), ST_PointOnSurface(g.geometry), ST_NPoints(s.geom), now()
    FROM geography.geometries g
    CROSS JOIN (VALUES ${bandValues()}) AS b(band, tolerance)
    CROSS JOIN LATERAL (
      SELECT ST_SnapToGrid(ST_SimplifyPreserveTopology(g.geometry, b.tolerance), ${OUTLINE_GRID}) AS geom
    ) s
    WHERE g.deleted_at IS NULL AND g.to_year IS NULL AND NOT ST_IsEmpty(s.geom)
      AND ST_GeometryType(ST_Envelope(g.geometry)) = 'ST_Polygon';`,
  pieces: () => `
    DELETE FROM geography.pieces;
    INSERT INTO geography.pieces (id, created_at, feature_id, geometry_id, geometry)
    SELECT gen_random_uuid(), now(), d.feature_id, d.geometry_id, d.geom
    FROM (
      SELECT g.feature_id, g.id AS geometry_id, (ST_Dump(ST_Subdivide(g.geometry, ${PIECE_VERTICES}))).geom AS geom
      FROM geography.geometries g
      WHERE g.deleted_at IS NULL AND g.to_year IS NULL AND ST_Dimension(g.geometry) = 2
    ) d
    WHERE ST_GeometryType(d.geom) = 'ST_Polygon';`,
  figures: () => `
    DELETE FROM statistics.figures WHERE indicator_id IS NOT NULL;
    INSERT INTO statistics.figures (id, created_at, indicator_id, feature_id, subject_id, country_id, from_year, to_year,
      starts_on, ends_on, value, lower, upper, status, basis, cell, observation_id, refreshed_at)
    SELECT DISTINCT ON (o.country_id, o.indicator_id, o.feature_id, o.subject_id, o.from_year, o.to_year, o.cell)
      gen_random_uuid(), now(), o.indicator_id, o.feature_id, o.subject_id, o.country_id, o.from_year, o.to_year,
      o.starts_on, o.ends_on, o.value, o.lower, o.upper, o.status, o.basis, o.cell, o.id, now()
    FROM statistics.observations o
    LEFT JOIN statistics.collections c ON c.id = o.collection_id
    LEFT JOIN statistics.priorities p
      ON p.country_id = o.country_id AND p.deleted_at IS NULL
     AND (p.collection_id = o.collection_id OR (c.steward_id IS NOT NULL AND p.steward_id = c.steward_id))
    WHERE o.deleted_at IS NULL
    ORDER BY o.country_id, o.indicator_id, o.feature_id, o.subject_id, o.from_year, o.to_year, o.cell,
      coalesce(p.position, 2147483647), o.revision DESC, (o.status = 'final') DESC, o.id;`,
};

export async function refresh(sql: SQL, targets: readonly RefreshTarget[]): Promise<string[]> {
  const lines: string[] = [];
  for (const target of targets) {
    const started = performance.now();
    await sql.begin(async (tx) => {
      await tx.unsafe(REFRESH_SQL[target]());
    });
    const table = target === "figures" ? "statistics.figures" : `geography.${target}`;
    const [row] = await sql.unsafe<{ count: string }[]>(`SELECT count(*)::text AS count FROM ${table}`);
    lines.push(`${table}: ${row?.count ?? "0"} rows in ${Math.round(performance.now() - started)} ms`);
  }
  return lines;
}

interface MonthlyParent {
  readonly schema: string;
  readonly table: string;
}

/** The first day of the month `months` after the given year and month (1-based). */
function monthStart(year: number, month: number, months: number): { year: number; month: number } {
  const index = year * 12 + (month - 1) + months;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

function isoMonth(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

/**
 * Creates the missing monthly partitions `<table>_YYYY_MM` of every RANGE-partitioned table that already has monthly
 * children, from the month after its newest child through `through` (default: MONTHS_AHEAD months from now).
 * Rows that already sit in a table's DEFAULT partition for a new month must be moved first; the command refuses then.
 */
export async function partitions(sql: SQL, through?: string): Promise<string[]> {
  const now = new Date();
  const target = through
    ? { year: Number(through.slice(0, 4)), month: Number(through.slice(5, 7)) }
    : monthStart(now.getUTCFullYear(), now.getUTCMonth() + 1, MONTHS_AHEAD);
  if (!Number.isInteger(target.year) || !Number.isInteger(target.month) || target.month < 1 || target.month > 12)
    throw new Error("--through must be YYYY-MM");
  const parents = await sql<MonthlyParent[]>`
    SELECT n.nspname AS schema, c.relname AS table
    FROM pg_partitioned_table p
    JOIN pg_class c ON c.oid = p.partrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE p.partstrat = 'r' AND NOT c.relispartition
    ORDER BY 1, 2`;
  const lines: string[] = [];
  for (const parent of parents) {
    const children = await sql<{ name: string }[]>`
      SELECT c.relname AS name FROM pg_inherits i
      JOIN pg_class c ON c.oid = i.inhrelid
      JOIN pg_class p ON p.oid = i.inhparent
      JOIN pg_namespace n ON n.oid = p.relnamespace
      WHERE n.nspname = ${parent.schema} AND p.relname = ${parent.table}`;
    const months = children
      .map(({ name }) => name.slice(parent.table.length + 1).split("_"))
      .filter((parts) => parts.length === 2 && parts[0]?.length === 4 && parts[1]?.length === 2)
      .map((parts) => ({ year: Number(parts[0]), month: Number(parts[1]) }))
      .filter((m) => Number.isInteger(m.year) && Number.isInteger(m.month));
    if (months.length === 0) continue;
    const newest = months.reduce((a, b) => (a.year * 12 + a.month >= b.year * 12 + b.month ? a : b));
    let created = 0;
    for (let next = monthStart(newest.year, newest.month, 1); next.year * 12 + next.month <= target.year * 12 + target.month; ) {
      const after = monthStart(next.year, next.month, 1);
      const name = `${parent.table}_${next.year}_${String(next.month).padStart(2, "0")}`;
      await sql.unsafe(
        `CREATE TABLE "${parent.schema}"."${name}" PARTITION OF "${parent.schema}"."${parent.table}" FOR VALUES FROM ('${isoMonth(next.year, next.month)}') TO ('${isoMonth(after.year, after.month)}')`,
      );
      created += 1;
      next = after;
    }
    lines.push(`${parent.schema}.${parent.table}: ${created} partition(s) added through ${isoMonth(target.year, target.month)}`);
  }
  return lines;
}
