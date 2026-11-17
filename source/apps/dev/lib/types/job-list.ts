import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { type Job } from "#/lib/types/job.ts";

/** Job List */
export interface JobList {
  jobs: Job[];
}

/** Field metadata for forms and results. */
export const JobListFields: readonly FieldMeta[] = [
  { name: "jobs", label: "Jobs", kind: "other", required: true },
];
