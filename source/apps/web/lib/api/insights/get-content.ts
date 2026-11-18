import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type ContentInput, ContentInputFields } from "#/lib/types/content-input.ts";
import { type ContentPage, ContentPageFields } from "#/lib/types/content-page.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getContentInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: ContentInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getContentOutputFields: readonly FieldMeta[] | undefined = ContentPageFields;
/** This operation has no query plan, so no paging is known. */
export const getContentPage: PageNames | undefined = undefined;

/** Values for each input port of Get Content. */
export type GetContentPorts = {
  input?: ContentInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getContentRequest(ports: GetContentPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * One explanatory text by its address or by the record it is about, with image references resolved to addresses.
 *
 * GET /v1/content. Used when no operation.client pack is bound.
 */
export async function getContent(input: ClientInput = {}): Promise<ClientResponse<ContentPage>> {
  const path = "/v1/content";
  return send("GET", path, input);
}
