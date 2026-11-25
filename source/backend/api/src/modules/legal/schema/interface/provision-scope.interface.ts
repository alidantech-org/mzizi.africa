import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Provision Scope */
export interface ProvisionScope {
  instrumentId: Id;
  limit?: Integer;
  offset?: Integer;
}
