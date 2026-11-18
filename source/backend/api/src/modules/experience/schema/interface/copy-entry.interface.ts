import type { Code } from "#/modules/experience/schema/type/code.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/** Copy Entry */
export interface CopyEntry {
  key: Code;
  text: NonEmptyString500;
}
