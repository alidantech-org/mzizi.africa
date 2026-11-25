import type { CommitmentEntry } from "#/modules/politics/schema/interface/commitment-entry.interface.ts";

/** Commitment Collection */
export interface CommitmentCollection {
  commitments: CommitmentEntry[];
}
