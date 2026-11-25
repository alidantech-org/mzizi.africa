import { CommunityAttestationStatus } from "#sdk/types/community/enums/attestation-status.ts";
import { CommunityPlatform } from "#sdk/types/community/enums/platform.ts";

/** A device an actor uses. */
export interface CommunityDevices {
  actorId: string;
  appVersion?: string | null;
  attestation: CommunityAttestationStatus;
  createdAt: string;
  deletedAt?: string | null;
  fingerprintHash: string;
  firstSeenAt: string;
  id: string;
  lastSeenAt: string;
  platform: CommunityPlatform;
  updatedAt: string;
  version: number;
}
