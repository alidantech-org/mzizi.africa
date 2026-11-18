import { ScriptsScriptState } from "#sdk/types/enums/scripts/script-state.ts";
import type { ScriptsScriptRequest } from "#sdk/types/scripts/script-request.ts";

/** Script Job */
export interface ScriptsScriptJob {
  cancel_requested: boolean;
  error: string | null;
  exit_code: number | null;
  finished_at: string | null;
  id: string;
  image_id: string;
  request: ScriptsScriptRequest;
  script_sha256: string;
  started_at: string;
  status: ScriptsScriptState;
  stderr: string;
  stderr_sha256: string | null;
  stdout: string;
  stdout_sha256: string | null;
}
