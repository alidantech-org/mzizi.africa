import type { DataSource, EntityMetadata } from "typeorm";

import { resolvePayload, tableOf } from "./resolve.ts";

/**
 * Candidate validation (DATA_INTAKE_PLAN.md section 6). Per-domain rules come from the entity
 * metadata generated from the Dryv contracts; cross-domain rules are written here. Errors make a
 * candidate `invalid`; a candidate without errors becomes `in_review`. Quarantined candidates are
 * never validated forward.
 */
export interface Issue {
  rule: string;
  severity: "error" | "warning" | "info";
  message: string;
}

export const VALIDATION_RULES = ["unknown_target", "unknown_field", "required", "type", "enum", "length", "reference", "geometry", "containment", "level", "money", "date_precision", "natural_key", "licence"] as const;

/** Columns the engine fills in at promotion; they are not required in a payload. */
const ENGINE_FIELDS = new Set(["id", "createdAt", "updatedAt", "version", "isCurrent", "versionNumber"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const error = (rule: string, message: string): Issue => ({ rule, severity: "error", message });
const warning = (rule: string, message: string): Issue => ({ rule, severity: "warning", message });

function typeIssues(meta: EntityMetadata, payload: Record<string, unknown>): Issue[] {
  const issues: Issue[] = [];
  for (const [field, value] of Object.entries(payload)) {
    const column = meta.columns.find((candidate) => candidate.propertyName === field);
    if (!column || value === null || value === undefined) continue;
    const type = String(column.type instanceof Function ? column.type.name : column.type).toLowerCase();
    const bad = (expected: string) => issues.push(error("type", `${field} should be ${expected}, got ${JSON.stringify(value).slice(0, 60)}`));
    if (column.enum && column.enum.length) {
      if (!column.enum.map(String).includes(String(value))) issues.push(error("enum", `${field}=${JSON.stringify(value)} is not one of ${column.enum.join(", ")}`));
      continue;
    }
    if (type === "uuid") {
      if (typeof value !== "string" || !UUID.test(value)) bad("a uuid");
    } else if (type === "date") {
      if (typeof value !== "string" || !ISO_DATE.test(value)) bad("an ISO date YYYY-MM-DD (a bare year is not an exact date)");
    } else if (type.startsWith("timestamp")) {
      if (typeof value !== "string" || Number.isNaN(Date.parse(value))) bad("an ISO timestamp");
    } else if (["integer", "int", "int4", "bigint", "smallint"].includes(type)) {
      if (!Number.isInteger(Number(value))) bad("an integer");
    } else if (["numeric", "decimal", "float", "double precision", "real", "float8"].includes(type)) {
      if (Number.isNaN(Number(value))) bad("a number");
    } else if (type === "boolean" || type === "bool") {
      if (typeof value !== "boolean") bad("a boolean");
    } else if (["varchar", "character varying", "text", "string"].includes(type)) {
      if (typeof value !== "string") bad("a string");
      else if (column.length && value.length > Number(column.length)) issues.push(error("length", `${field} is ${value.length} characters, the maximum is ${column.length}`));
    }
  }
  return issues;
}

async function geometryIssues(db: DataSource, meta: EntityMetadata, payload: Record<string, unknown>): Promise<Issue[]> {
  const issues: Issue[] = [];
  for (const field of ["geometry", "labelPoint"]) {
    const text = payload[field];
    if (typeof text !== "string" || !meta.columns.some((column) => column.propertyName === field)) continue;
    try {
      const [row] = await db.query(`SELECT ST_IsValid(g) AS valid, ST_IsEmpty(g) AS empty, ST_XMin(g) AS xmin, ST_XMax(g) AS xmax, ST_YMin(g) AS ymin, ST_YMax(g) AS ymax FROM (SELECT ST_SetSRID(ST_GeomFromGeoJSON($1), 4326) AS g) t`, [text]);
      if (row.empty) issues.push(error("geometry", `${field} is empty`));
      else if (!row.valid) issues.push(error("geometry", `${field} is not a valid geometry`));
      if (row.xmin < -180 || row.xmax > 180 || row.ymin < -90 || row.ymax > 90) issues.push(error("geometry", `${field} lies outside the WGS84 longitude and latitude range`));
    } catch (cause) {
      issues.push(error("geometry", `${field} is not parseable GeoJSON: ${(cause as Error).message.split("\n")[0]}`));
    }
  }
  return issues;
}

/** A boundary must lie inside its unit's parent boundary, within a tolerance (about 1 km, and at most 2 percent of the child's area outside). */
async function containmentIssues(db: DataSource, payload: Record<string, unknown>): Promise<Issue[]> {
  if (typeof payload.unitId !== "string" || typeof payload.geometry !== "string") return [];
  const [unit] = await db.query(`SELECT parent_id FROM geography.units WHERE id = $1`, [payload.unitId]);
  if (!unit?.parent_id) return [];
  const [parent] = await db.query(
    `SELECT s.geom FROM geography.boundaries b JOIN geography.boundary_shapes s ON s.boundary_id = b.id WHERE b.unit_id = $1 AND b.is_current AND s.is_valid LIMIT 1`,
    [unit.parent_id],
  );
  if (!parent) return [warning("containment", "the parent unit has no valid current boundary, so containment was not checked")];
  const [row] = await db.query(
    `SELECT CASE WHEN ST_Area(c) = 0 THEN 1 ELSE ST_Area(ST_Difference(c, ST_Buffer(p, 0.01))) / ST_Area(c) END AS outside
       FROM (SELECT ST_SetSRID(ST_GeomFromGeoJSON($1), 4326) AS c, (SELECT geom FROM geography.boundary_shapes WHERE boundary_id = (SELECT b.id FROM geography.boundaries b WHERE b.unit_id = $2 AND b.is_current LIMIT 1)) AS p) t`,
    [payload.geometry, unit.parent_id],
  );
  return row.outside > 0.02 ? [error("containment", `${(row.outside * 100).toFixed(1)}% of the boundary lies outside its parent unit`)] : [];
}

/** A unit's level must sit below its parent's level, in the same jurisdiction. */
async function levelIssues(db: DataSource, payload: Record<string, unknown>): Promise<Issue[]> {
  if (typeof payload.levelId !== "string") return [];
  const [level] = await db.query(`SELECT "order", jurisdiction_id, scheme FROM reference.classifications WHERE id = $1`, [payload.levelId]);
  if (!level) return [error("level", "levelId does not exist")];
  const issues: Issue[] = [];
  if (level.scheme !== "geography/level") issues.push(error("level", `levelId is a ${level.scheme} classification, not geography/level`));
  if (payload.jurisdictionId && level.jurisdiction_id !== payload.jurisdictionId) issues.push(error("level", "the level belongs to another jurisdiction"));
  if (typeof payload.parentId === "string") {
    const [parent] = await db.query(`SELECT c."order" AS parent_order FROM geography.units u JOIN reference.classifications c ON c.id = u.level_id WHERE u.id = $1`, [payload.parentId]);
    if (!parent) issues.push(error("reference", "parentId does not exist"));
    else if (level.order !== null && parent.parent_order !== null && level.order <= parent.parent_order) issues.push(error("level", `level order ${level.order} is not below its parent's level order ${parent.parent_order}`));
  }
  return issues;
}

function moneyIssues(meta: EntityMetadata, payload: Record<string, unknown>): Issue[] {
  const names = new Set(meta.columns.map((column) => column.propertyName));
  const currencyField = ["currency", "currencyCode"].find((name) => names.has(name));
  const amountFields = [...names].filter((name) => /(^|[a-z])Amount$|^amount$|Amount[A-Z]/.test(name) && payload[name] !== null && payload[name] !== undefined);
  if (!currencyField || amountFields.length === 0) return [];
  const currency = payload[currencyField];
  return typeof currency === "string" && /^[A-Z]{3}$/.test(currency) ? [] : [error("money", `${amountFields.join(", ")} given without a three-letter ${currencyField}; currency is never assumed`)];
}

function datePrecisionIssues(meta: EntityMetadata, payload: Record<string, unknown>): Issue[] {
  const issues: Issue[] = [];
  for (const column of meta.columns.filter((candidate) => meta.columns.some((other) => other.propertyName === `${candidate.propertyName}Precision`))) {
    if (payload[column.propertyName] && !payload[`${column.propertyName}Precision`]) issues.push(error("date_precision", `${column.propertyName} has no ${column.propertyName}Precision`));
  }
  return issues;
}

export async function validatePayload(db: DataSource, target: string, rawPayload: Record<string, unknown>, keyFields: string[] = []): Promise<Issue[]> {
  let meta: EntityMetadata;
  try {
    meta = tableOf(db, target);
  } catch {
    return [error("unknown_target", `${target} is not a stored table`)];
  }
  const issues: Issue[] = [];
  const { payload, errors } = await resolvePayload(db, rawPayload);
  for (const e of errors) issues.push(error("reference", `${e.field}: ${e.message}`));
  const known = new Set(meta.columns.map((column) => column.propertyName));
  for (const field of Object.keys(payload)) if (!known.has(field) && !field.endsWith("Precision")) issues.push(error("unknown_field", `${target} has no field ${field}`));
  for (const column of meta.columns) {
    if (ENGINE_FIELDS.has(column.propertyName) || column.isNullable || column.default !== undefined || column.isGenerated) continue;
    if (column.relationMetadata && !column.isVirtual) continue;
    if ((payload[column.propertyName] === undefined || payload[column.propertyName] === null) && !errors.some((e) => e.field === column.propertyName)) issues.push(error("required", `${column.propertyName} is required`));
  }
  for (const key of keyFields) if (payload[key] === undefined || payload[key] === null || payload[key] === "") issues.push(error("natural_key", `key field ${key} is empty`));
  issues.push(...typeIssues(meta, payload), ...(await geometryIssues(db, meta, payload)), ...moneyIssues(meta, payload), ...datePrecisionIssues(meta, payload));
  // Cross-record rules only make sense once the payload's own references and types are sound.
  const sound = !issues.some((i) => ["geometry", "reference", "type", "unknown_field", "required"].includes(i.rule));
  if (sound && target === "geography.boundaries") issues.push(...(await containmentIssues(db, payload)));
  if (sound && target === "geography.units") issues.push(...(await levelIssues(db, payload)));
  // plain-id references must resolve: foreign relations and the known soft references by name
  const softTargets: Record<string, string> = { jurisdictionId: "reference.jurisdictions", unitId: target.startsWith("finance.") ? "finance.units" : "geography.units", parentId: target, publisherId: "source.publishers", kindId: "reference.classifications", levelId: "reference.classifications" };
  for (const [field, kind] of Object.entries(softTargets)) {
    const value = payload[field];
    if (typeof value !== "string" || !known.has(field) || !UUID.test(value) || issues.some((i) => i.rule === "reference" && i.message.startsWith(`${field}:`))) continue;
    const other = tableOf(db, kind);
    const rows = await db.query(`SELECT 1 FROM "${other.schema}"."${other.tableName}" WHERE id = $1`, [value]);
    if (rows.length === 0) issues.push(error("reference", `${field} ${value} does not exist in ${kind}`));
  }
  return issues;
}

/** Validates every pending or invalid candidate of a run (or all): errors make it invalid, otherwise it goes to review. */
export async function validateCandidates(db: DataSource, runId?: string): Promise<{ checked: number; invalid: number; inReview: number }> {
  const rows: Array<{ id: string; target_kind: string; payload: Record<string, unknown>; key_fields: string[] }> = await db.query(
    `SELECT id, target_kind, payload, key_fields FROM staging.candidates WHERE status IN ('pending','invalid') AND ($1::uuid IS NULL OR run_id = $1) ORDER BY created_at`,
    [runId ?? null],
  );
  let invalid = 0;
  let inReview = 0;
  for (const row of rows) {
    const issues = await validatePayload(db, row.target_kind, row.payload, row.key_fields);
    await db.transaction(async (tx) => {
      await tx.query(`DELETE FROM staging.issues WHERE candidate_id = $1 AND rule = ANY($2)`, [row.id, [...VALIDATION_RULES]]);
      for (const issue of issues) await tx.query(`INSERT INTO staging.issues (candidate_id, rule, severity, message) VALUES ($1, $2, $3, $4)`, [row.id, issue.rule, issue.severity, issue.message]);
      const failed = issues.some((issue) => issue.severity === "error");
      await tx.query(`UPDATE staging.candidates SET status = $2 WHERE id = $1`, [row.id, failed ? "invalid" : "in_review"]);
      failed ? invalid++ : inReview++;
    });
  }
  return { checked: rows.length, invalid, inReview };
}
