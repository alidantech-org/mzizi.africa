import { AuthLoginKind } from "#sdk/types/auth/enums/login-kind.ts";

/** A way an account signs in: email or phone with one-time codes, or an OIDC issuer and subject. */
export interface AuthLogins {
  accountId: string;
  id: string;
  issuer?: string | null;
  kind: AuthLoginKind;
  lastAuthenticatedAt?: string | null;
  linkedAt: string;
  subject?: string | null;
  unlinkedAt?: string | null;
  value?: string | null;
  verifiedAt?: string | null;
}
