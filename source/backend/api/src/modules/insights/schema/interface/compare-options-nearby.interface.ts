import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/** Compare Options Nearby */
export interface CompareOptionsNearby {
  distanceKm: Number;
  featureId: String;
  kindLabel: String;
  name: String;
  path: String;
}
