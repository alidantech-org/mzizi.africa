import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type StructureDocument, StructureDocumentFields } from "#/lib/types/structure-document.ts";
import { type StructureInput, StructureInputFields } from "#/lib/types/structure-input.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getStructureScreenInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: StructureInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getStructureScreenOutputFields: readonly FieldMeta[] | undefined =
  StructureDocumentFields;
/** This operation is not paged. */
export const getStructureScreenPage: PageNames | undefined = undefined;

/** Values for each input port of Get Structure Screen. */
export type GetStructureScreenPorts = {
  input?: StructureInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getStructureScreenRequest(ports: GetStructureScreenPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * Country governance structure with typed positions, offices, powers, procedures and responsibilities. Scope is explicitly national; missing records do not establish absence.
 *
 * GET /v1/structure. Used when no operation.client pack is bound.
 */
export async function getStructureScreen(
  input: ClientInput = {},
): Promise<ClientResponse<StructureDocument>> {
  const path = "/v1/structure";
  return send("GET", path, input);
}
