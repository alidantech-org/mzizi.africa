/** Scoped role grant to an account, optionally through a membership or delegation, with revocation history. */
export interface AuthRoleAssignments {
  accountId: string;
  createdAt: string;
  delegationId?: string | null;
  expiresAt?: string | null;
  grantedBy: string;
  id: string;
  membershipId?: string | null;
  revocationReason?: string | null;
  revokedAt?: string | null;
  revokedBy?: string | null;
  roleId: string;
  scopeId: string;
  startsAt?: string | null;
}
