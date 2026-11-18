import { RuntimeJobEventType } from "#sdk/types/enums/runtime/job-event-type.ts";

/** Job Event */
export interface RuntimeJobEvent {
  at: string;
  data?: unknown;
  id: string;
  jobId: string;
  message?: string;
  runId?: string;
  sequence: number;
  type: RuntimeJobEventType;
}
