import type { FieldMeta } from "#/lib/dryv/transport.ts";
import { JobStatus } from "#/lib/types/job-status.enum.ts";

/** List Jobs Input */
export interface ListJobsInput {
  limit?: number;
  status?: JobStatus;
}

/** Field metadata for forms and results. */
export const ListJobsInputFields: readonly FieldMeta[] = [
  { name: "limit", label: "Limit", kind: "number", required: false },
  {
    name: "status",
    label: "Status",
    kind: "enum",
    required: false,
    options: Object.values(JobStatus),
  },
];
