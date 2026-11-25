import { SharedFigureStatus } from "#sdk/types/shared/enums/figure-status.ts";

/** Registered and cast votes of a contest in one place, by revision. */
export interface ElectionTurnouts {
  cast?: number | null;
  collectionId?: string | null;
  contestId: string;
  createdAt: string;
  deletedAt?: string | null;
  featureId: string;
  id: string;
  registered?: number | null;
  rejected?: number | null;
  revision: number;
  spoilt?: number | null;
  status: SharedFigureStatus;
  supersedesId?: string | null;
  updatedAt: string;
  valid?: number | null;
  version: number;
}
