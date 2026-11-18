import { RunLedgerLedgerRunState } from "#sdk/types/enums/run-ledger/ledger-run-state.ts";
import type { RunLedgerLedgerDecision } from "#sdk/types/run-ledger/ledger-decision.ts";
import type { RunLedgerLedgerStageCount } from "#sdk/types/run-ledger/ledger-stage-count.ts";
import type { RunLedgerRunArtifactDocument } from "#sdk/types/run-ledger/run-artifact-document.ts";

/** Run Summary Document */
export interface RunLedgerRunSummaryDocument {
  approvalJson?: string;
  approver?: string;
  counts: RunLedgerLedgerStageCount[];
  decisions: RunLedgerLedgerDecision[];
  files: RunLedgerRunArtifactDocument[];
  finishedAt: string;
  manifestHash?: string;
  runId: string;
  specHash: string;
  state: RunLedgerLedgerRunState;
}
