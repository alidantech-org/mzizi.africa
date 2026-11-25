import { CivicScoreBasis } from "#sdk/types/civic/enums/score-basis.ts";

/** Prepared, reviewable comparison of a contract or project with comparable prices; never a finding or accusation. */
export interface CivicScores {
  basis: CivicScoreBasis;
  comparables: number;
  computedAt: string;
  confidence?: number | null;
  contractId?: string | null;
  createdAt: string;
  deletedAt?: string | null;
  high?: number | null;
  id: string;
  low?: number | null;
  projectId?: string | null;
  score?: number | null;
  updatedAt: string;
  version: number;
}
