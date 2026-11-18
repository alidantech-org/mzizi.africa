import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type SaveFileBody, SaveFileBodyFields } from "#/lib/types/save-file-body.ts";
import { type SaveFileResult, SaveFileResultFields } from "#/lib/types/save-file-result.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const saveFileInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  body: SaveFileBodyFields,
};
/** Field metadata of the output, when it is a schema. */
export const saveFileOutputFields: readonly FieldMeta[] | undefined = SaveFileResultFields;
/** This operation has no query plan, so no paging is known. */
export const saveFilePage: PageNames | undefined = undefined;

/** Values for each input port of Save File. */
export type SaveFilePorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  body?: SaveFileBody;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function saveFileRequest(ports: SaveFilePorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
    },
    body: ports.body,
  };
}

/**
 * Save a text file under the dev root (never outside it).
 *
 * PUT /v1/explore/file. Used when no operation.client pack is bound.
 */
export async function saveFile(input: ClientInput = {}): Promise<ClientResponse<SaveFileResult>> {
  const path = "/v1/explore/file";
  return send("PUT", path, input);
}
