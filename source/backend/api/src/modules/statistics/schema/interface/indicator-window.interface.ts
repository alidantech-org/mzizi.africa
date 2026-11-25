import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Indicator Window */
export interface IndicatorWindow {
  limit?: Integer;
  offset?: Integer;
  topicTerm?: Id;
}
