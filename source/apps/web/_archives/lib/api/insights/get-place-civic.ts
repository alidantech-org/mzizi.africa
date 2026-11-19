import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type PlaceCivic,
  PlaceCivicFields,
} from "#/_archives/lib/types/place-civic";
import { PlaceOnlyFields } from "#/_archives/lib/types/place-only";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getPlaceCivicInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  input: PlaceOnlyFields,
};
/** Field metadata of the output, when it is a schema. */
export const getPlaceCivicOutputFields: readonly FieldMeta[] | undefined =
  PlaceCivicFields;
/** This operation has no query plan, so no paging is known. */
export const getPlaceCivicPage: PageNames | undefined = undefined;

/** Values for each input port of Get Place Civic. */
export type GetPlaceCivicPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  featureId?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getPlaceCivicRequest(
  ports: GetPlaceCivicPorts = {},
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
 * Civic delivery in a place: fund allocations and spending by class and year, projects with locations, infrastructure and leadership.
 *
 * GET /v1/civic/places/{featureId}. Used when no operation.client pack is bound.
 */
export async function getPlaceCivic(
  input: ClientInput = {},
): Promise<ClientResponse<PlaceCivic>> {
  const path = "/v1/civic/places/{featureId}".replace(
    "{featureId}",
    encodeURIComponent(input.params?.["featureId"] ?? ""),
  );
  return send("GET", path, input);
}
