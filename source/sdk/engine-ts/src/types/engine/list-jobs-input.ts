import { EngineJobStatus } from "#sdk/types/enums/engine/job-status.ts";

/** List Jobs Input */
export interface EngineListJobsInput {
  limit?: number;
  status?: EngineJobStatus;
}
