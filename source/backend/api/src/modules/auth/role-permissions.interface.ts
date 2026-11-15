
import type { Id } from "#/modules/shared/id.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Permission granted to a role, with who granted it and when. */
export interface RolePermissions {
  grantedAt: Instant;
  grantedBy: Id;
  permissionId: Id;
  roleId: Id;
}