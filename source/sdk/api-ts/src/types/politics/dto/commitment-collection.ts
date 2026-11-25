import type { PoliticsCommitmentEntry } from "#sdk/types/politics/dto/commitment-entry.ts";

/** Commitment Collection */
export interface PoliticsCommitmentCollection {
  commitments: PoliticsCommitmentEntry[];
}
