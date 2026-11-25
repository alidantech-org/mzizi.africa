import { AuthCodeChannel } from "#sdk/types/auth/enums/code-channel.ts";
import { AuthCodePurpose } from "#sdk/types/auth/enums/code-purpose.ts";

/** A one-time sign-up or sign-in code. */
export interface AuthCodes {
  attempts: number;
  channel: AuthCodeChannel;
  consumedAt?: string | null;
  createdAt: string;
  digest: string;
  expiresAt: string;
  id: string;
  loginId?: string | null;
  purpose: AuthCodePurpose;
  value?: string | null;
}
