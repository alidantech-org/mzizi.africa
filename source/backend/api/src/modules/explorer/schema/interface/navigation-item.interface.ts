import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";

/** Navigation Item */
export interface NavigationItem {
  available: Flag;
  view: NonEmptyString255;
}
