import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { JobDetailInputFields } from "#/lib/types/job-detail-input.ts";
import { type JobDetail, JobDetailFields } from "#/lib/types/job-detail.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getJobDetailInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: JobDetailInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getJobDetailOutputFields: readonly FieldMeta[] | undefined = JobDetailFields;
/** This operation has no query plan, so no paging is known. */
export const getJobDetailPage: PageNames | undefined = undefined;

/** Values for each input port of Get Job Detail. */
export type GetJobDetailPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  jobId?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getJobDetailRequest(ports: GetJobDetailPorts = {}): ClientInput {
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
 * One job with its event timeline and the folder it wrote.
 *
 * GET /v1/explore/jobs/{jobId}. Used when no operation.client pack is bound.
 */
export async function getJobDetail(input: ClientInput = {}): Promise<ClientResponse<JobDetail>> {
  const path = "/v1/explore/jobs/{jobId}".replace(
    "{jobId}",
    encodeURIComponent(input.params?.["jobId"] ?? ""),
  );
  return send("GET", path, input);
}
