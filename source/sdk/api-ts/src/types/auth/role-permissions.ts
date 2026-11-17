/** Permission granted to a role, with who granted it and when. */
export interface AuthRolePermissions {
  grantedAt: string;
  grantedBy: string;
  permissionId: string;
  roleId: string;
}
