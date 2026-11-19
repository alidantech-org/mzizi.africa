import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Institution Detail Metrics */
export interface InstitutionDetailMetrics {
  label: String;
  value: Number;
}
