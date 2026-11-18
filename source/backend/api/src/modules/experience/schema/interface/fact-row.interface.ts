import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";

/** Fact Row */
export interface FactRow {
  code: NonEmptyString255;
  detail?: Description | null;
  place?: Name | null;
  statement: Name;
  tagged: Flag;
}
