/** Single-use invitation to an institution; only a digest of the token is stored. */
export interface AuthInvitations {
  acceptedAccountId?: string | null;
  acceptedAt?: string | null;
  createdAt: string;
  expiresAt?: string | null;
  id: string;
  institutionRefId: string;
  intendedEmail: string;
  invitedBy: string;
  revokedAt?: string | null;
  tokenDigest: string;
}
