/** External issuer and subject linked to one account; unlinking is recorded, never deleted. */
export interface AuthLoginIdentities {
  accountId: string;
  id: string;
  issuer: string;
  lastAuthenticatedAt?: string | null;
  linkedAt: string;
  subject: string;
  unlinkedAt?: string | null;
}
