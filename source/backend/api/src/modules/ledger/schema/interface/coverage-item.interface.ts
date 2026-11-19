import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Coverage Item */
export interface CoverageItem {
  checkedOn?: String | null;
  code: String;
  expectedAt?: String | null;
  level?: String | null;
  note?: String | null;
  source?: String | null;
  subject: String;
}
