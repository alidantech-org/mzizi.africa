import { CommunityLocationCheck } from "#sdk/types/community/enums/location-check.ts";

/** A location check that a contribution was made from where it claims. */
export interface CommunityProofs {
  accuracyMeters?: number | null;
  actorId: string;
  attestationOk?: boolean | null;
  check: CommunityLocationCheck;
  coarseCell?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  deviceId: string;
  headerAgrees?: boolean | null;
  id: string;
  matchedFeatureId?: string | null;
  mockLocationDetected: boolean;
  recordedAt: string;
  travelOk?: boolean | null;
  trustScore: number;
  updatedAt: string;
  version: number;
}
