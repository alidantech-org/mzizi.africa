import { RuntimeRunStatus } from "#sdk/types/enums/runtime/run-status.ts";

/** Run Window */
export interface RuntimeRunWindow {
  limit?: number;
  status?: RuntimeRunStatus;
}
