import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type RootList, RootListFields } from "#/lib/types/root-list.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listFileRootsInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {};
/** Field metadata of the output, when it is a schema. */
export const listFileRootsOutputFields: readonly FieldMeta[] | undefined = RootListFields;
/** This operation has no query plan, so no paging is known. */
export const listFileRootsPage: PageNames | undefined = undefined;

/** Values for each input port of List File Roots. */
export type ListFileRootsPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listFileRootsRequest(ports: ListFileRootsPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
    },
  };
}

/**
 * The folders the explorer may show.
 *
 * GET /v1/explore/roots. Used when no operation.client pack is bound.
 */
export async function listFileRoots(input: ClientInput = {}): Promise<ClientResponse<RootList>> {
  const path = "/v1/explore/roots";
  return send("GET", path, input);
}
