import type { DataSource } from "typeorm";

/**
 * Jurisdiction-wide scope (DEC-JURISDICTION-WIDE-SCOPE, TSK-D034AD29926E). A record that belongs to a whole jurisdiction points
 * at the jurisdiction's root geography unit; a null scope is a reported gap, never "national". Nothing is guessed: a name is
 * resolved only by a stated rule against a level, the match must be unique, and two records may not claim the same unit.
 */
export interface Unit {
  id: string;
  code: string;
  name: string;
  level: string;
  parentId: string | null;
}

export const normalise = (text: string): string =>
  text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((word) => word && !["county", "constituency", "government", "assembly", "of", "ngcdf", "committee", "ng", "cdf", "the", "senator", "member", "national"].includes(word))
    .join(" ");

export function editDistance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0]!;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const held = row[j]!;
      row[j] = Math.min(row[j]! + 1, row[j - 1]! + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = held;
    }
  }
  return row[b.length]!;
}

/**
 * Resolves a name to one unit of the given level, or `undefined` when there is none or more than one.
 * Rules, in order: equal after normalisation; otherwise exactly one unit within edit distance 1 (names of at least 5 letters),
 * which catches spelling variants such as `bureti` for `Buret`.
 */
export function resolveName(name: string, units: Unit[], level: string, within?: string): Unit | undefined {
  const wanted = normalise(name);
  if (!wanted) return undefined;
  const pool = units.filter((unit) => unit.level === level && (!within || unit.parentId === within));
  const exact = pool.filter((unit) => normalise(unit.name) === wanted);
  if (exact.length > 0) return exact.length === 1 ? exact[0] : undefined;
  if (wanted.length < 5) return undefined;
  const near = pool.filter((unit) => editDistance(normalise(unit.name), wanted) <= 1);
  return near.length === 1 ? near[0] : undefined;
}

export async function currentUnits(db: DataSource, jurisdictionId?: string): Promise<Unit[]> {
  const rows: Array<{ id: string; code: string; name: string; level: string; parent_id: string | null }> = await db.query(
    `SELECT u.id, u.code, u.name, l.label AS level, u.parent_id FROM geography.units u JOIN reference.classifications l ON l.id = u.level_id WHERE u.is_current AND ($1::uuid IS NULL OR u.jurisdiction_id = $1)`,
    [jurisdictionId ?? null],
  );
  return rows.map((row) => ({ id: row.id, code: row.code, name: row.name, level: row.level, parentId: row.parent_id }));
}

export interface ScopeReport {
  officesScoped: string[];
  officesLeft: string[];
  financeUnitsRoot: number;
  financeUnitsResolved: number;
  financeUnitsLeft: number;
  datasetsRoot: number;
}

/** Keeps a resolution only when no other record resolved to the same unit. */
function distinct<T extends { unit: Unit }>(items: T[]): T[] {
  const count = new Map<string, number>();
  for (const item of items) count.set(item.unit.id, (count.get(item.unit.id) ?? 0) + 1);
  return items.filter((item) => count.get(item.unit.id) === 1);
}

export async function backfillScope(db: DataSource): Promise<ScopeReport> {
  const units = await currentUnits(db);
  const byCode = new Map(units.map((unit) => [unit.code, unit]));

  // 1. Offices that name a seat by a variant spelling.
  const offices: Array<{ id: string; code: string }> = await db.query(
    `SELECT id, code FROM governance.offices WHERE scope_geo_unit_id IS NULL AND is_current AND code ~ '^ke/(senate|national-assembly)/[^/]+(/[^/]+)?$' AND code !~ '/nominated(/|$)' AND code !~ '^ke/national-assembly/elect/' ORDER BY code`,
  );
  const plainSeats: Array<{ slug: string; scope: string | null }> = await db.query(
    `SELECT split_part(code, '/', 3) AS slug, scope_geo_unit_id AS scope FROM governance.offices WHERE code ~ '^ke/national-assembly/[^/]+$' AND is_current`,
  );
  const plainScopedToConstituency = new Set(plainSeats.filter((seat) => seat.scope && units.find((unit) => unit.id === seat.scope)?.level === "constituency").map((seat) => seat.slug));
  const resolved: Array<{ id: string; code: string; unit: Unit }> = [];
  for (const office of offices) {
    const [, house, slug, person] = office.code.split("/");
    let unit: Unit | undefined;
    if (house === "senate") unit = resolveName(slug!, units, "county");
    else if (person) {
      // A second seat named by person and slug: the county's woman representative (Constitution art. 97(1)(b)) when the slug names no
      // constituency, or when the constituency seat of that slug already exists on its own.
      const constituency = resolveName(slug!, units, "constituency");
      if (!constituency || plainScopedToConstituency.has(slug!)) unit = resolveName(slug!, units, "county");
    } else {
      // A plain seat is a constituency member only when exactly one constituency matches and no county shares the name.
      const constituency = resolveName(slug!, units, "constituency");
      if (constituency && !resolveName(slug!, units, "county")) unit = constituency;
    }
    if (unit) resolved.push({ id: office.id, code: office.code, unit });
  }
  const accepted = distinct(resolved);
  for (const item of accepted) {
    await db.query(`UPDATE governance.offices SET scope_geo_unit_id = $1, updated_at = now(), version = version + 1 WHERE id = $2 AND scope_geo_unit_id IS NULL`, [item.unit.id, item.id]);
  }
  const officesLeft: string[] = (await db.query(`SELECT code FROM governance.offices WHERE scope_geo_unit_id IS NULL AND is_current ORDER BY code`)).map((row: { code: string }) => row.code);

  // 2. Finance units. National bodies point at the root unit; county governments and NG-CDF committees resolve by name.
  const roots: Array<{ jurisdiction_id: string; id: string }> = await db.query(`SELECT jurisdiction_id, id FROM geography.units WHERE parent_id IS NULL AND is_current`);
  const rootOf = new Map(roots.map((root) => [root.jurisdiction_id, root.id]));
  const finance: Array<{ id: string; code: string; name: string; jurisdiction_id: string; entity_type: string | null }> = await db.query(
    `SELECT f.id, f.code, f.name, f.jurisdiction_id, (SELECT c.label FROM organization.entities e JOIN reference.classifications c ON c.id = e.entity_type_id WHERE e.code = f.code AND e.is_current LIMIT 1) AS entity_type
       FROM finance.units f WHERE f.geo_unit_id IS NULL AND f.is_current ORDER BY f.code`,
  );
  let financeUnitsRoot = 0;
  const toResolve: Array<{ id: string; unit: Unit }> = [];
  const nationalTypes = new Set(["ministry, department or agency", "state corporation or independent body", "other public entity"]);
  for (const unit of finance) {
    const root = rootOf.get(unit.jurisdiction_id);
    if (!root) throw new Error(`jurisdiction ${unit.jurisdiction_id} has no root geography unit (finance unit ${unit.code})`);
    const number = Number(/^ke\/pe\/(\d+)$/.exec(unit.code)?.[1] ?? NaN);
    const nationalListed = Number.isFinite(number) && number <= 5168; // the national government block of the procuring-entity register
    if (unit.code.startsWith("ke/party-finance/") || unit.code === "ke/ngcdf/board" || unit.code.startsWith("ke/fund/") || (unit.entity_type && nationalTypes.has(unit.entity_type) && !/county/i.test(unit.name)) || (nationalListed && unit.entity_type !== "county government or assembly" && !/county/i.test(unit.name))) {
      await db.query(`UPDATE finance.units SET geo_unit_id = $1, updated_at = now(), version = version + 1 WHERE id = $2`, [root, unit.id]);
      financeUnitsRoot++;
    } else if (unit.entity_type === "county government or assembly") {
      const county = resolveName(unit.name, units, "county");
      if (county) toResolve.push({ id: unit.id, unit: county });
    } else if (unit.code.startsWith("ke/ngcdf/")) {
      const parts = unit.code.split("/");
      const county = parts.length === 4 ? resolveName(parts[2]!, units, "county") : undefined;
      const constituency = resolveName(parts[parts.length - 1]!, units, "constituency", county?.id);
      if (constituency) toResolve.push({ id: unit.id, unit: constituency });
    }
  }
  // A county government and its assembly share a county unit legitimately; constituency committees must not collide.
  const committees = toResolve.filter((item) => item.unit.level === "constituency");
  const clash = new Set(committees.map((item) => item.unit.id).filter((id, index, all) => all.indexOf(id) !== index));
  let financeUnitsResolved = 0;
  for (const item of toResolve) {
    if (clash.has(item.unit.id)) continue;
    await db.query(`UPDATE finance.units SET geo_unit_id = $1, updated_at = now(), version = version + 1 WHERE id = $2`, [item.unit.id, item.id]);
    financeUnitsResolved++;
  }
  const [{ n: financeUnitsLeft }] = await db.query(`SELECT count(*)::int AS n FROM finance.units WHERE geo_unit_id IS NULL AND is_current`);

  // 3. Statistical datasets cover a whole jurisdiction.
  const datasetsRoot = (await db.query(
    `WITH upd AS (UPDATE statistical.datasets d SET geo_unit_id = (SELECT r.id FROM geography.units r WHERE r.jurisdiction_id = d.jurisdiction_id AND r.parent_id IS NULL AND r.is_current), updated_at = now(), version = d.version + 1
       WHERE d.geo_unit_id IS NULL AND d.is_current AND (SELECT count(*) FROM geography.units r WHERE r.jurisdiction_id = d.jurisdiction_id AND r.parent_id IS NULL AND r.is_current) = 1 RETURNING 1) SELECT count(*)::int AS n FROM upd`,
  ))[0].n;
  void byCode;
  return { officesScoped: accepted.map((item) => `${item.code} -> ${item.unit.code}`), officesLeft, financeUnitsRoot, financeUnitsResolved, financeUnitsLeft, datasetsRoot };
}

/** Records that belong to a jurisdiction with a single root unit but carry no scope: the scope-gap check. */
export const scopedTables: Array<{ table: string; column: string; label: string }> = [
  { table: "governance.institutions", column: "scope_geo_unit_id", label: "institutions" },
  { table: "governance.offices", column: "scope_geo_unit_id", label: "offices" },
  { table: "finance.units", column: "geo_unit_id", label: "finance units" },
  { table: "statistical.datasets", column: "geo_unit_id", label: "statistical datasets" },
];
