import type { ZoomBand } from "#/modules/geography/schema/type/zoom-band.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/** Outline Entry */
export interface OutlineEntry {
  band: ZoomBand;
  featureId: Id;
  geometryId: Id;
  points: NonNegativeInteger;
  roleTerm: Id;
}
