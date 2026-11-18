import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type ContentListInput, ContentListInputFields } from "#/lib/types/content-list-input.ts";
import { type ContentList, ContentListFields } from "#/lib/types/content-list.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listContentInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: ContentListInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const listContentOutputFields: readonly FieldMeta[] | undefined = ContentListFields;
/** This operation has no query plan, so no paging is known. */
export const listContentPage: PageNames | undefined = undefined;

/** Values for each input port of List Content. */
export type ListContentPorts = {
  input?: ContentListInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listContentRequest(ports: ListContentPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * Explanatory texts by category or tag, for the Learn section.
 *
 * GET /v1/content/list. Used when no operation.client pack is bound.
 */
export async function listContent(input: ClientInput = {}): Promise<ClientResponse<ContentList>> {
  const path = "/v1/content/list";
  return send("GET", path, input);
}
