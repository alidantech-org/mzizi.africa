import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/** Compare Options Input */
export interface CompareOptionsInput {
  featureId: Id;
  metric?: Code;
}
