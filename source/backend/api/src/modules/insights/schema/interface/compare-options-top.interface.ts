import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Compare Options Top */
export interface CompareOptionsTop {
  detail: String;
  featureId: String;
  name: String;
  path: String;
  rank: Number;
  share: Number;
  subjectId?: String | null;
  value: Number;
}
