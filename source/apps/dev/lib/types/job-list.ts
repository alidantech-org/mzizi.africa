import type { FieldMeta } from "../dryv/transport.ts";
import { type Job } from "./job.ts";

/** Job List */
export interface JobList {
  jobs: Job[];
}

/** Field metadata for forms and results. */
export const JobListFields: readonly FieldMeta[] = [
  { name: "jobs", label: "Jobs", kind: "other", required: true },
];
