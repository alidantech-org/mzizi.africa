import type { FieldMeta } from "../dryv/transport.ts";

/** Submit Job Body */
export interface SubmitJobBody {
  idempotencyKey?: string;
  input?: unknown;
  kind: string;
  runId?: string;
}

/** Field metadata for forms and results. */
export const SubmitJobBodyFields: readonly FieldMeta[] = [
  {
    name: "idempotencyKey",
    label: "Idempotency Key",
    kind: "string",
    required: false,
  },
  { name: "input", label: "Input", kind: "other", required: false },
  { name: "kind", label: "Kind", kind: "string", required: true },
  { name: "runId", label: "Run Id", kind: "string", required: false },
];
