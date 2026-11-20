import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";

/** Copy Entry */
export interface CopyEntry {
  key: NonEmptyString255;
  text: Description;
}
