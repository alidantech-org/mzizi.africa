import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/** Governance Identity Scope */
export interface GovernanceIdentityScope {
  identityId: Id;
  limit?: Integer;
  offset?: Integer;
}
