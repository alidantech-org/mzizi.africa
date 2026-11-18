import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { Limit } from "#/modules/insights/schema/type/limit.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/** Board Input */
export interface BoardInput {
  kindCode?: IdentityCode;
  limit?: Limit;
  metricCode: Code;
  parentFeatureId?: Id;
}
