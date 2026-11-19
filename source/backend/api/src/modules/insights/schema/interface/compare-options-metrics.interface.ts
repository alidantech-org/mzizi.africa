import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Compare Options Metrics */
export interface CompareOptionsMetrics {
  code: String;
  describe: String;
  domain: String;
  higherIsBetter: Flag;
  title: String;
  unit: String;
}
