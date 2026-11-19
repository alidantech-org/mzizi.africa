import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type SearchQuery,
  SearchQueryFields,
} from "#/_archives/lib/types/search-query";
import {
  type SearchResults,
  SearchResultsFields,
} from "#/_archives/lib/types/search-results";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const globalSearchInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  input: SearchQueryFields,
};
/** Field metadata of the output, when it is a schema. */
export const globalSearchOutputFields: readonly FieldMeta[] | undefined =
  SearchResultsFields;
/** This operation has no query plan, so no paging is known. */
export const globalSearchPage: PageNames | undefined = undefined;

/** Values for each input port of Global Search. */
export type GlobalSearchPorts = {
  input?: SearchQuery;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function globalSearchRequest(
  ports: GlobalSearchPorts = {},
): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * One search over places, leaders, parties, projects, tenders, indicators, sources and laws; every hit says what it is.
 *
 * GET /v1/search. Used when no operation.client pack is bound.
 */
export async function globalSearch(
  input: ClientInput = {},
): Promise<ClientResponse<SearchResults>> {
  const path = "/v1/search";
  return send("GET", path, input);
}
