import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/** Gov Tree Input */
export interface GovTreeInput {
  featureId?: Id;
  institution?: Code;
  tab?: Code;
}
