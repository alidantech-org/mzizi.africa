
import type { AuthAction } from "#/modules/auth/auth-action.enum.ts";
import type { Description } from "#/modules/shared/description.type.ts";
import type { Flag } from "#/modules/shared/flag.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";

/** Named action on a resource type, optionally narrowed to a field group. */
export interface Permissions {
  action: AuthAction;
  code: IdentityCode;
  description?: Description | null;
  fieldGroup?: NonEmptyString255 | null;
  id: Id;
  isActive: Flag;
  resourceType: NonEmptyString255;
}