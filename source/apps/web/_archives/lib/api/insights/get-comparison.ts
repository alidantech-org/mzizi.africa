import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type ComparisonInput,
  ComparisonInputFields,
} from "#/_archives/lib/types/comparison-input";
import {
  type Comparison,
  ComparisonFields,
} from "#/_archives/lib/types/comparison";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getComparisonInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  input: ComparisonInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getComparisonOutputFields: readonly FieldMeta[] | undefined =
  ComparisonFields;
/** This operation has no query plan, so no paging is known. */
export const getComparisonPage: PageNames | undefined = undefined;

/** Values for each input port of Get Comparison. */
export type GetComparisonPorts = {
  input?: ComparisonInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getComparisonRequest(
  ports: GetComparisonPorts = {},
): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * Two places on the same figures, aligned, with the difference in percent.
 *
 * GET /v1/compare. Used when no operation.client pack is bound.
 */
export async function getComparison(
  input: ClientInput = {},
): Promise<ClientResponse<Comparison>> {
  const path = "/v1/compare";
  return send("GET", path, input);
}
