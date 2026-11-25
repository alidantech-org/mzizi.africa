/** A single-use invitation to an institution. */
export interface AuthInvitations {
  acceptedAccountId?: string | null;
  acceptedAt?: string | null;
  createdAt: string;
  expiresAt?: string | null;
  id: string;
  institutionId: string;
  intendedEmail: string;
  invitedBy: string;
  revokedAt?: string | null;
  tokenDigest: string;
}
