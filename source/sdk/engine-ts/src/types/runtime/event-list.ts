import type { RuntimeJobEvent } from "#sdk/types/runtime/job-event.ts";

/** Event List */
export interface RuntimeEventList {
  events: RuntimeJobEvent[];
}
