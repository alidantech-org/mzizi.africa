import type { Degrees } from "#/modules/explorer/schema/type/degrees.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { BoundaryShape } from "#/modules/explorer/schema/interface/boundary-shape.interface.ts";
import type { Place } from "#/modules/explorer/schema/interface/place.interface.ts";

/** Boundaries */
export interface Boundaries {
  bbox: Degrees[];
  gaps: NonEmptyString500[];
  place: Place;
  shapes: BoundaryShape[];
  withoutBoundary: NonNegativeInteger;
}
