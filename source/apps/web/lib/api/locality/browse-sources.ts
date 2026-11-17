import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type SourceCollection, SourceCollectionFields } from "#/lib/types/source-collection.ts";
import {
  type SourceSearchInput,
  SourceSearchInputFields,
} from "#/lib/types/source-search-input.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const browseSourcesInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: SourceSearchInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const browseSourcesOutputFields: readonly FieldMeta[] | undefined = SourceCollectionFields;
/** This operation has no query plan, so no paging is known. */
export const browseSourcesPage: PageNames | undefined = undefined;

/** Values for each input port of Browse Sources. */
export type BrowseSourcesPorts = {
  input?: SourceSearchInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function browseSourcesRequest(ports: BrowseSourcesPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * The data sources behind the platform, with their publisher and how many artifacts and citations each has.
 *
 * GET /v1/sources. Used when no operation.client pack is bound.
 */
export async function browseSources(
  input: ClientInput = {},
): Promise<ClientResponse<SourceCollection>> {
  const path = "/v1/sources";
  return send("GET", path, input);
}
