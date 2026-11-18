import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type PrepareRequest, PrepareRequestFields } from "#/lib/types/prepare-request.ts";
import { type PrepareResult, PrepareResultFields } from "#/lib/types/prepare-result.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const prepareCsvInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  body: PrepareRequestFields,
};
/** Field metadata of the output, when it is a schema. */
export const prepareCsvOutputFields: readonly FieldMeta[] | undefined = PrepareResultFields;
/** This operation has no query plan, so no paging is known. */
export const prepareCsvPage: PageNames | undefined = undefined;

/** Values for each input port of Prepare Csv. */
export type PrepareCsvPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  body?: PrepareRequest;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function prepareCsvRequest(ports: PrepareCsvPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
    },
    body: ports.body,
  };
}

/**
 * Preview (or save, when save_as is set) a cleaned copy of a CSV.
 *
 * POST /v1/explore/csv/prepare. Used when no operation.client pack is bound.
 */
export async function prepareCsv(input: ClientInput = {}): Promise<ClientResponse<PrepareResult>> {
  const path = "/v1/explore/csv/prepare";
  return send("POST", path, input);
}
