import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Feature Window */
export interface FeatureWindow {
  codePrefix?: IdentityCode;
  featureTypeId?: Id;
  limit?: Integer;
  offset?: Integer;
}
