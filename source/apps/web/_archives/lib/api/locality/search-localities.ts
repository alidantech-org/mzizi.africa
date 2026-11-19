import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type LocalityMatches,
  LocalityMatchesFields,
} from "#/_archives/lib/types/locality-matches";
import {
  type SearchInput,
  SearchInputFields,
} from "#/_archives/lib/types/search-input";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const searchLocalitiesInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  input: SearchInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const searchLocalitiesOutputFields: readonly FieldMeta[] | undefined =
  LocalityMatchesFields;
/** This operation has no query plan, so no paging is known. */
export const searchLocalitiesPage: PageNames | undefined = undefined;

/** Values for each input port of Search Localities. */
export type SearchLocalitiesPorts = {
  input?: SearchInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function searchLocalitiesRequest(
  ports: SearchLocalitiesPorts = {},
): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * Places whose name matches the text, in any language, narrowest units first.
 *
 * GET /v1/locality/search. Used when no operation.client pack is bound.
 */
export async function searchLocalities(
  input: ClientInput = {},
): Promise<ClientResponse<LocalityMatches>> {
  const path = "/v1/locality/search";
  return send("GET", path, input);
}
