import { RuntimeRunStatus } from "#sdk/types/enums/runtime/run-status.ts";

/** Run */
export interface RuntimeRun {
  finishedAt?: string;
  id: string;
  jobIds: string[];
  kind: string;
  note?: string;
  startedAt: string;
  status: RuntimeRunStatus;
}
