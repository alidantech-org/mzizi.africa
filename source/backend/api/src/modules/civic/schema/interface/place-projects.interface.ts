import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Place Projects */
export interface PlaceProjects {
  featureId: Id;
  limit?: Integer;
  offset?: Integer;
}
