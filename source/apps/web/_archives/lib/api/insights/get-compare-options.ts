import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type CompareOptionsInput,
  CompareOptionsInputFields,
} from "#/_archives/lib/types/compare-options-input";
import {
  type CompareOptions,
  CompareOptionsFields,
} from "#/_archives/lib/types/compare-options";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getCompareOptionsInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  input: CompareOptionsInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getCompareOptionsOutputFields: readonly FieldMeta[] | undefined =
  CompareOptionsFields;
/** This operation has no query plan, so no paging is known. */
export const getCompareOptionsPage: PageNames | undefined = undefined;

/** Values for each input port of Get Compare Options. */
export type GetCompareOptionsPorts = {
  input?: CompareOptionsInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getCompareOptionsRequest(
  ports: GetCompareOptionsPorts = {},
): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * Places worth comparing a place with: the ten closest by geography, the ten top performers, and the ladder of the units above it, saying plainly which rungs do not exist.
 *
 * GET /v1/compare/options. Used when no operation.client pack is bound.
 */
export async function getCompareOptions(
  input: ClientInput = {},
): Promise<ClientResponse<CompareOptions>> {
  const path = "/v1/compare/options";
  return send("GET", path, input);
}
