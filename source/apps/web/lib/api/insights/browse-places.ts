import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type BrowseInput, BrowseInputFields } from "#/lib/types/browse-input.ts";
import { type PlaceBrowse, PlaceBrowseFields } from "#/lib/types/place-browse.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const browsePlacesInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: BrowseInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const browsePlacesOutputFields: readonly FieldMeta[] | undefined = PlaceBrowseFields;
/** This operation has no query plan, so no paging is known. */
export const browsePlacesPage: PageNames | undefined = undefined;

/** Values for each input port of Browse Places. */
export type BrowsePlacesPorts = {
  input?: BrowseInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function browsePlacesRequest(ports: BrowsePlacesPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * The country's hierarchy one level at a time (county, constituency, ward, town, village), with the path to the current unit.
 *
 * GET /v1/browse. Used when no operation.client pack is bound.
 */
export async function browsePlaces(input: ClientInput = {}): Promise<ClientResponse<PlaceBrowse>> {
  const path = "/v1/browse";
  return send("GET", path, input);
}
