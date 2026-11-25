/** What a role may do: a permission granted to a role, with who granted it and when. */
export interface AuthPrivileges {
  grantedAt: string;
  grantedBy: string;
  permissionId: string;
  roleId: string;
}
