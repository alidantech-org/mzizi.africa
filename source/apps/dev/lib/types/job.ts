import type { FieldMeta } from "../dryv/transport.ts";
import { JobStatus } from "./job-status.enum.ts";

/** Job */
export interface Job {
  attempts: number;
  error?: string;
  id: string;
  kind: string;
  result?: unknown;
  runId?: string;
  status: JobStatus;
}

/** Field metadata for forms and results. */
export const JobFields: readonly FieldMeta[] = [
  { name: "attempts", label: "Attempts", kind: "number", required: true },
  { name: "error", label: "Error", kind: "string", required: false },
  { name: "id", label: "Id", kind: "string", required: true },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "result", label: "Result", kind: "other", required: false },
  { name: "runId", label: "Run Id", kind: "string", required: false },
  {
    name: "status",
    label: "Status",
    kind: "enum",
    required: true,
    options: Object.values(JobStatus),
  },
];
