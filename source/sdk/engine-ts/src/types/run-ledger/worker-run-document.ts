import { RunLedgerLedgerRunState } from "#sdk/types/enums/run-ledger/ledger-run-state.ts";

/** Worker Run Document */
export interface RunLedgerWorkerRunDocument {
  approvalJson?: string;
  attempts: number;
  availableAt?: string;
  cancelRequestedAt?: string;
  failureType?: string;
  finishedAt?: string;
  heartbeatAt?: string;
  leaseExpiresAt?: string;
  leaseId?: string;
  logsExpired?: boolean;
  manifestHash?: string;
  releasePlanHash?: string;
  requestedAt: string;
  requestedBy?: string;
  revision?: number;
  runId: string;
  runStore?: string;
  sealedAt?: string;
  specHash: string;
  specJson: string;
  stagesCompleted?: number;
  startedAt?: string;
  state: RunLedgerLedgerRunState;
}
