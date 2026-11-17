import type { Confidence } from "#/modules/shared/schema/type/confidence.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Feature Geometry */
export interface FeatureGeometry {
  basisId: Id;
  centroid: unknown;
  confidence?: Confidence | null;
  featureId: Id;
  geometry: unknown;
  geometryId: Id;
  geometryRoleId: Id;
  maxZoom?: NonNegativeInteger | null;
  minZoom?: NonNegativeInteger | null;
  observedAt?: Instant | null;
  revision: PositiveInteger;
  validFrom: Instant;
}
