import type { FieldMeta } from "#/lib/dryv/transport.ts";

/** Job Detail Input */
export interface JobDetailInput {
  jobId: string;
}

/** Field metadata for forms and results. */
export const JobDetailInputFields: readonly FieldMeta[] = [
  { name: "jobId", label: "Job Id", kind: "string", required: true },
];
