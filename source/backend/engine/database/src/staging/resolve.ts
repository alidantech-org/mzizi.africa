import type { DataSource, EntityMetadata } from "typeorm";

/** A reference to another record by natural key, produced by the data engine's `ref` transform. */
export interface RefValue {
  $ref: { kind: string; where: Record<string, unknown> };
}

export const isRef = (value: unknown): value is RefValue => typeof value === "object" && value !== null && "$ref" in (value as object);

export function tableOf(db: DataSource, kind: string): EntityMetadata {
  const meta = db.entityMetadatas.find((candidate) => `${candidate.schema}.${candidate.tableName}` === kind);
  if (!meta) throw new Error(`no stored table ${kind}`);
  return meta;
}

/** Looks up the id a reference points at: the current row of the kind whose columns equal the given values. */
export async function resolveRef(db: DataSource, ref: RefValue["$ref"]): Promise<{ id?: string; error?: string }> {
  let meta: EntityMetadata;
  try {
    meta = tableOf(db, ref.kind);
  } catch (error) {
    return { error: (error as Error).message };
  }
  const wheres: string[] = [];
  const params: unknown[] = [];
  for (const [property, value] of Object.entries(ref.where)) {
    const column = meta.columns.find((candidate) => candidate.propertyName === property);
    if (!column) return { error: `${ref.kind} has no field ${property}` };
    params.push(value);
    wheres.push(`"${column.databaseName}" = $${params.length}`);
  }
  if (meta.columns.some((column) => column.propertyName === "isCurrent")) wheres.push(`"is_current" = true`);
  const rows: Array<{ id: string }> = await db.query(`SELECT id FROM "${meta.schema}"."${meta.tableName}" WHERE ${wheres.join(" AND ")} LIMIT 2`, params);
  if (rows.length === 0) return { error: `${ref.kind} ${JSON.stringify(ref.where)} does not exist (promote it first)` };
  if (rows.length > 1) return { error: `${ref.kind} ${JSON.stringify(ref.where)} is ambiguous` };
  return { id: rows[0]!.id };
}

/** Replaces every reference in a payload with the id it points at; unresolved references are returned as errors. */
export async function resolvePayload(db: DataSource, payload: Record<string, unknown>): Promise<{ payload: Record<string, unknown>; errors: Array<{ field: string; message: string }> }> {
  const out: Record<string, unknown> = {};
  const errors: Array<{ field: string; message: string }> = [];
  for (const [field, value] of Object.entries(payload)) {
    if (isRef(value)) {
      const resolved = await resolveRef(db, value.$ref);
      if (resolved.error) errors.push({ field, message: resolved.error });
      else out[field] = resolved.id;
    } else out[field] = value;
  }
  return { payload: out, errors };
}
