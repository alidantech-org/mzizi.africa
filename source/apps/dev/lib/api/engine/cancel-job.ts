import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type Job, JobFields } from "#/lib/types/job.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const cancelJobInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {};
/** Field metadata of the output, when it is a schema. */
export const cancelJobOutputFields: readonly FieldMeta[] | undefined = JobFields;
/** This operation has no query plan, so no paging is known. */
export const cancelJobPage: PageNames | undefined = undefined;

/** Values for each input port of Cancel Job. */
export type CancelJobPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  jobId?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function cancelJobRequest(ports: CancelJobPorts = {}): ClientInput {
  return {
    params: {
      jobId: String(ports.jobId),
    },
    query: {
      ...ports.input,
    },
  };
}

/**
 * Cancel a queued or running job.
 *
 * POST /v1/jobs/{jobId}/cancel. Used when no operation.client pack is bound.
 */
export async function cancelJob(input: ClientInput = {}): Promise<ClientResponse<Job>> {
  const path = "/v1/jobs/{jobId}/cancel".replace(
    "{jobId}",
    encodeURIComponent(input.params?.["jobId"] ?? ""),
  );
  return send("POST", path, input);
}
