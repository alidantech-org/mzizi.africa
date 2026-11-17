import { AuthAuthAction } from "#sdk/types/enums/auth/auth-action.ts";

/** Named action on a resource type, optionally narrowed to a field group. */
export interface AuthPermissions {
  action: AuthAuthAction;
  code: string;
  description?: string | null;
  fieldGroup?: string | null;
  id: string;
  isActive: boolean;
  resourceType: string;
}
