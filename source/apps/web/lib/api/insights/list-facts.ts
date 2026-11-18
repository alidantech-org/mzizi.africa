import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type FactList, FactListFields } from "#/lib/types/fact-list.ts";
import { type FactsInput, FactsInputFields } from "#/lib/types/facts-input.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listFactsInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: FactsInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const listFactsOutputFields: readonly FieldMeta[] | undefined = FactListFields;
/** This operation has no query plan, so no paging is known. */
export const listFactsPage: PageNames | undefined = undefined;

/** Values for each input port of List Facts. */
export type ListFactsPorts = {
  input?: FactsInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listFactsRequest(ports: ListFactsPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * Did-you-know facts about the country, and those tagged to a place and the places above it.
 *
 * GET /v1/facts. Used when no operation.client pack is bound.
 */
export async function listFacts(input: ClientInput = {}): Promise<ClientResponse<FactList>> {
  const path = "/v1/facts";
  return send("GET", path, input);
}
