/** Time-limited delegation of scoped access from one account to another. */
export interface AuthDelegations {
  createdAt: string;
  delegateAccountId: string;
  delegatorAccountId: string;
  expiresAt?: string | null;
  id: string;
  revokedAt?: string | null;
  revokedBy?: string | null;
  scopeId: string;
  startsAt?: string | null;
}
