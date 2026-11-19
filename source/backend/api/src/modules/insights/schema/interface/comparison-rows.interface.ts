import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Comparison Rows */
export interface ComparisonRows {
  a: Number;
  b: Number;
  code: String;
  diffPercent?: Number | null;
  higherIsBetter: Flag;
  title: String;
  unit: String;
}
