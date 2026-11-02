import { BadRequestException, NotFoundException } from "@nestjs/common";
import type { DataSource } from "typeorm";

import { targetKinds } from "#/auth/access-rules.generated";

/**
 * Audit records point at another record by kind (its schema-qualified table, for example geography.units) and id. The kind must be one of
 * the contract's evidenced entities, which also makes it safe to use as a table name below, and
 * the record must exist.
 */
export async function assertTarget(readDb: DataSource, targetKind: string, targetId: string): Promise<void> {
  if (!(targetKinds as readonly string[]).includes(targetKind)) throw new BadRequestException(`unknown targetKind: ${targetKind}`);
  const [schema, table] = targetKind.split(".");
  const rows = await readDb.query(`SELECT 1 FROM "${schema}"."${table}" WHERE id = $1 LIMIT 1`, [targetId]);
  if (rows.length === 0) throw new NotFoundException(`${targetKind} ${targetId} not found`);
}
