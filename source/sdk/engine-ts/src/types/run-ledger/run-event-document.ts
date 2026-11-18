import { RunLedgerLedgerEventLevel } from "#sdk/types/enums/run-ledger/ledger-event-level.ts";
import { RunLedgerLedgerRunState } from "#sdk/types/enums/run-ledger/ledger-run-state.ts";

/** Run Event Document */
export interface RunLedgerRunEventDocument {
  eventId: string;
  expiresAt: string;
  failureType?: string;
  level: RunLedgerLedgerEventLevel;
  runId: string;
  stage?: string;
  state: RunLedgerLedgerRunState;
  time: string;
}
