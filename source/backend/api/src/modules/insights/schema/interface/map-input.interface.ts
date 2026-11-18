import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/** Map Input */
export interface MapInput {
  indicatorCode: Code;
  kindCode?: IdentityCode;
  parentFeatureId?: Id;
}
