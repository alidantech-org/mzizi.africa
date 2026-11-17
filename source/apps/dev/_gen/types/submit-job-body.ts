

/** Submit Job Body */
export interface SubmitJobBody {
  idempotencyKey?: string;
  input?: unknown;
  kind: string;
  runId?: string;
}