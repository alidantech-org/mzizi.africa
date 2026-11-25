import type { ZoomBand } from "#/modules/geography/schema/type/zoom-band.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Outline Window */
export interface OutlineWindow {
  band: ZoomBand;
  featureId: Id;
  limit?: Integer;
  offset?: Integer;
}
