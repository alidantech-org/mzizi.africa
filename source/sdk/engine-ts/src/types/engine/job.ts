import { EngineJobStatus } from "#sdk/types/enums/engine/job-status.ts";

/** Job */
export interface EngineJob {
  attempts: number;
  error?: string;
  id: string;
  kind: string;
  result?: unknown;
  runId?: string;
  status: EngineJobStatus;
}
