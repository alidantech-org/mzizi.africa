/** Who holds which role, within which scope, with revocation history. */
export interface AuthGrants {
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
