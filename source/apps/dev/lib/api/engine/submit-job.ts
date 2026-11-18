import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type Job, JobFields } from "#/lib/types/job.ts";
import { type SubmitJobBody, SubmitJobBodyFields } from "#/lib/types/submit-job-body.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const submitJobInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  body: SubmitJobBodyFields,
};
/** Field metadata of the output, when it is a schema. */
export const submitJobOutputFields: readonly FieldMeta[] | undefined = JobFields;
/** This operation has no query plan, so no paging is known. */
export const submitJobPage: PageNames | undefined = undefined;

/** Values for each input port of Submit Job. */
export type SubmitJobPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  body?: SubmitJobBody;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function submitJobRequest(ports: SubmitJobPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
    },
    body: ports.body,
  };
}

/**
 * Queue a job. Repeating an idempotency key returns the first job.
 *
 * POST /v1/jobs. Used when no operation.client pack is bound.
 */
export async function submitJob(input: ClientInput = {}): Promise<ClientResponse<Job>> {
  const path = "/v1/jobs";
  return send("POST", path, input);
}
