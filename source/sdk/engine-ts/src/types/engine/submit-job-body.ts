/** Submit Job Body */
export interface EngineSubmitJobBody {
  idempotencyKey?: string;
  input?: unknown;
  kind: string;
  runId?: string;
}
