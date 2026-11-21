import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { Context } from "#/modules/explorer/schema/interface/context.interface.ts";
import type { PlaceGroup } from "#/modules/explorer/schema/interface/place-group.interface.ts";
import type { Places } from "#/modules/explorer/schema/interface/places.interface.ts";

/** Location */
export interface Location {
  context: Context;
  found?: Places | null;
  gaps: NonEmptyString500[];
  groups: PlaceGroup[];
}
