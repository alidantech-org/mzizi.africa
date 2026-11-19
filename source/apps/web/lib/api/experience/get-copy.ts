import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type CopyCatalog, CopyCatalogFields } from "#/lib/types/copy-catalog.ts";
import { type CopyInput, CopyInputFields } from "#/lib/types/copy-input.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getCopyInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: CopyInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getCopyOutputFields: readonly FieldMeta[] | undefined = CopyCatalogFields;
/** This operation has no query plan, so no paging is known. */
export const getCopyPage: PageNames | undefined = undefined;

/** Values for each input port of Get Copy. */
export type GetCopyPorts = {
  input?: CopyInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getCopyRequest(ports: GetCopyPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * The interface wording for one language, with the country's own wording where it differs. Screens declare copy keys; the words are delivered from here.
 *
 * GET /v1/copy. Used when no operation.client pack is bound.
 */
export async function getCopy(input: ClientInput = {}): Promise<ClientResponse<CopyCatalog>> {
  const path = "/v1/copy";
  return send("GET", path, input);
}
