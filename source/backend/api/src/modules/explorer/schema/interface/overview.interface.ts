import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { Context } from "#/modules/explorer/schema/interface/context.interface.ts";
import type { Count } from "#/modules/explorer/schema/interface/count.interface.ts";
import type { Places } from "#/modules/explorer/schema/interface/places.interface.ts";

/** Overview */
export interface Overview {
  children: Places;
  context: Context;
  counts: Count[];
  gaps: NonEmptyString500[];
}
