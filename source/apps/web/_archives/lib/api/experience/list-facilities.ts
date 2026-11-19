import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type FacilitiesInput,
  FacilitiesInputFields,
} from "#/_archives/lib/types/facilities-input";
import {
  type FacilityList,
  FacilityListFields,
} from "#/_archives/lib/types/facility-list";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listFacilitiesInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  input: FacilitiesInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const listFacilitiesOutputFields: readonly FieldMeta[] | undefined =
  FacilityListFields;
/** This operation has no query plan, so no paging is known. */
export const listFacilitiesPage: PageNames | undefined = undefined;

/** Values for each input port of List Facilities. */
export type ListFacilitiesPorts = {
  input?: FacilitiesInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listFacilitiesRequest(
  ports: ListFacilitiesPorts = {},
): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * Civic infrastructure and offices by class and place: schools, hospitals, police stations, county and constituency offices, polling stations, with capacity and coordinates.
 *
 * GET /v1/facilities. Used when no operation.client pack is bound.
 */
export async function listFacilities(
  input: ClientInput = {},
): Promise<ClientResponse<FacilityList>> {
  const path = "/v1/facilities";
  return send("GET", path, input);
}
