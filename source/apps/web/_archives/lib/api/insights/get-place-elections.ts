import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type PlaceElections,
  PlaceElectionsFields,
} from "#/_archives/lib/types/place-elections";
import { PlaceOnlyFields } from "#/_archives/lib/types/place-only";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getPlaceElectionsInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  input: PlaceOnlyFields,
};
/** Field metadata of the output, when it is a schema. */
export const getPlaceElectionsOutputFields: readonly FieldMeta[] | undefined =
  PlaceElectionsFields;
/** This operation has no query plan, so no paging is known. */
export const getPlaceElectionsPage: PageNames | undefined = undefined;

/** Values for each input port of Get Place Elections. */
export type GetPlaceElectionsPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  featureId?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getPlaceElectionsRequest(
  ports: GetPlaceElectionsPorts = {},
): ClientInput {
  return {
    params: {
      featureId: String(ports.featureId),
    },
    query: {
      ...ports.input,
    },
  };
}

/**
 * Elections in a place over time: who won, with what votes, turnout and the registration trend.
 *
 * GET /v1/elections/places/{featureId}. Used when no operation.client pack is bound.
 */
export async function getPlaceElections(
  input: ClientInput = {},
): Promise<ClientResponse<PlaceElections>> {
  const path = "/v1/elections/places/{featureId}".replace(
    "{featureId}",
    encodeURIComponent(input.params?.["featureId"] ?? ""),
  );
  return send("GET", path, input);
}
