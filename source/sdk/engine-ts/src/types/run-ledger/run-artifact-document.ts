import { RunLedgerLedgerArtifactState } from "#sdk/types/enums/run-ledger/ledger-artifact-state.ts";

/** Run Artifact Document */
export interface RunLedgerRunArtifactDocument {
  derivedFrom: string[];
  mediaType: string;
  path: string;
  runId: string;
  sha256: string;
  size: number;
  sourceUrl?: string;
  stage: string;
  state: RunLedgerLedgerArtifactState;
}
