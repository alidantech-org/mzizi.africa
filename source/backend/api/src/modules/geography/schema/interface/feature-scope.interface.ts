import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Feature Scope */
export interface FeatureScope {
  featureId: Id;
  limit?: Integer;
  offset?: Integer;
}
