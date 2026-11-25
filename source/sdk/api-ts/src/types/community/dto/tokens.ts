import { CommunityPushProvider } from "#sdk/types/community/enums/push-provider.ts";

/** A push notification token of a device. */
export interface CommunityTokens {
  createdAt: string;
  deletedAt?: string | null;
  deviceId: string;
  enabledAt: string;
  id: string;
  provider: CommunityPushProvider;
  revokedAt?: string | null;
  token: string;
  updatedAt: string;
  version: number;
}
