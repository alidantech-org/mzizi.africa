import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Coalition */
export interface Coalition {
  code: String;
  dissolvedOn?: String | null;
  formedOn?: String | null;
  kind: String;
  name: String;
}
