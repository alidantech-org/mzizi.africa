import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type FacilityDetail, FacilityDetailFields } from "#/lib/types/facility-detail.ts";
import { FacilityKeyFields } from "#/lib/types/facility-key.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getFacilityInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: FacilityKeyFields,
};
/** Field metadata of the output, when it is a schema. */
export const getFacilityOutputFields: readonly FieldMeta[] | undefined = FacilityDetailFields;
/** This operation has no query plan, so no paging is known. */
export const getFacilityPage: PageNames | undefined = undefined;

/** Values for each input port of Get Facility. */
export type GetFacilityPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  code?: string;
  languageCode?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getFacilityRequest(ports: GetFacilityPorts = {}): ClientInput {
  return {
    params: {
      code: String(ports.code),
    },
    query: {
      ...ports.input,
      languageCode: ports.languageCode,
    },
  };
}

/**
 * One facility with its capacity, the places it is in and the polling stations it hosts.
 *
 * GET /v1/facilities/{code}. Used when no operation.client pack is bound.
 */
export async function getFacility(
  input: ClientInput = {},
): Promise<ClientResponse<FacilityDetail>> {
  const path = "/v1/facilities/{code}".replace(
    "{code}",
    encodeURIComponent(input.params?.["code"] ?? ""),
  );
  return send("GET", path, input);
}
