
import type { Id } from "#/modules/shared/id.type.ts";

/** Role included in a delegation. */
export interface DelegationRoles {
  delegationId: Id;
  roleId: Id;
}