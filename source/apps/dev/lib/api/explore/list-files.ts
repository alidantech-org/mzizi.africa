import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { ListFilesInputFields } from "#/lib/types/list-files-input.ts";
import { type Listing, ListingFields } from "#/lib/types/listing.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listFilesInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: ListFilesInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const listFilesOutputFields: readonly FieldMeta[] | undefined = ListingFields;
/** This operation has no query plan, so no paging is known. */
export const listFilesPage: PageNames | undefined = undefined;

/** Values for each input port of List Files. */
export type ListFilesPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  root?: string;
  path?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listFilesRequest(ports: ListFilesPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
      root: ports.root,
      path: ports.path,
    },
  };
}

/**
 * A folder's entries; a file path lists the folder that holds it.
 *
 * GET /v1/explore/files. Used when no operation.client pack is bound.
 */
export async function listFiles(input: ClientInput = {}): Promise<ClientResponse<Listing>> {
  const path = "/v1/explore/files";
  return send("GET", path, input);
}
