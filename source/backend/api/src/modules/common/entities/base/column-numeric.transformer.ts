import type { ValueTransformer } from "typeorm";

/**
 * Postgres returns bigint and numeric columns as strings. This keeps them as numbers
 * in the entity and writes them back unchanged.
 */
export class ColumnNumericTransformer implements ValueTransformer {
  to(value: number | null | undefined): number | null | undefined {
    return value;
  }

  from(value: string | number | null): number | null {
    return value === null ? null : Number(value);
  }
}
