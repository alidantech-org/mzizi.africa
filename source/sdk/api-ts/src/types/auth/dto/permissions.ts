import { AuthAuthAction } from "#sdk/types/auth/enums/auth-action.ts";
import { AuthResourceType } from "#sdk/types/auth/enums/resource-type.ts";

/** A named action on a resource type, optionally narrowed to a field group. */
export interface AuthPermissions {
  action: AuthAuthAction;
  code: string;
  description?: string | null;
  fieldGroup?: string | null;
  id: string;
  isActive: boolean;
  resourceType: AuthResourceType;
}
