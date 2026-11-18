import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type FileView, FileViewFields } from "#/lib/types/file-view.ts";
import { GetFileInputFields } from "#/lib/types/get-file-input.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getFileInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: GetFileInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getFileOutputFields: readonly FieldMeta[] | undefined = FileViewFields;
/** This operation has no query plan, so no paging is known. */
export const getFilePage: PageNames | undefined = undefined;

/** Values for each input port of Get File. */
export type GetFilePorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  root?: string;
  path?: string;
  offset?: number;
  limit?: number;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getFileRequest(ports: GetFilePorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
      root: ports.root,
      path: ports.path,
      offset: ports.offset,
      limit: ports.limit,
    },
  };
}

/**
 * One file viewed by kind: text, CSV rows, parsed JSON or YAML.
 *
 * GET /v1/explore/file. Used when no operation.client pack is bound.
 */
export async function getFile(input: ClientInput = {}): Promise<ClientResponse<FileView>> {
  const path = "/v1/explore/file";
  return send("GET", path, input);
}
