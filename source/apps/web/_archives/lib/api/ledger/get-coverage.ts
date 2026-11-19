import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type CoverageList,
  CoverageListFields,
} from "#/_archives/lib/types/coverage-list";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getCoverageInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {};
/** Field metadata of the output, when it is a schema. */
export const getCoverageOutputFields: readonly FieldMeta[] | undefined =
  CoverageListFields;
/** This operation has no query plan, so no paging is known. */
export const getCoveragePage: PageNames | undefined = undefined;

/** Values for each input port of Get Coverage. */
export type GetCoveragePorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getCoverageRequest(ports: GetCoveragePorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
    },
  };
}

/**
 * What the platform expects to be published and what has been checked: the honest map of what is missing.
 *
 * GET /v1/coverage. Used when no operation.client pack is bound.
 */
export async function getCoverage(
  input: ClientInput = {},
): Promise<ClientResponse<CoverageList>> {
  const path = "/v1/coverage";
  return send("GET", path, input);
}
