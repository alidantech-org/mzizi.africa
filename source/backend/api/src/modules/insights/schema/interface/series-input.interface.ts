import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/** Series Input */
export interface SeriesInput {
  featureId: Id;
  indicatorCode: Code;
}
