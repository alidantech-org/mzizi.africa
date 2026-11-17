import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type JobList, JobListFields } from "#/lib/types/job-list.ts";
import { ListJobsInputFields } from "#/lib/types/list-jobs-input.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listJobsInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: ListJobsInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const listJobsOutputFields: readonly FieldMeta[] | undefined = JobListFields;
/** This operation has no query plan, so no paging is known. */
export const listJobsPage: PageNames | undefined = undefined;

/** Values for each input port of List Jobs. */
export type ListJobsPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  status?: string;
  limit?: number;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listJobsRequest(ports: ListJobsPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
      status: ports.status,
      limit: ports.limit,
    },
  };
}

/**
 * Recent jobs, newest first, optionally by status.
 *
 * GET /v1/jobs. Used when no operation.client pack is bound.
 */
export async function listJobs(input: ClientInput = {}): Promise<ClientResponse<JobList>> {
  const path = "/v1/jobs";
  return send("GET", path, input);
}
