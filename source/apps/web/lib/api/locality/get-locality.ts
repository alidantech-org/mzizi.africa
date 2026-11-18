import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type LocalityProfile, LocalityProfileFields } from "#/lib/types/locality-profile.ts";
import { PlaceInputFields } from "#/lib/types/place-input.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getLocalityInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: PlaceInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getLocalityOutputFields: readonly FieldMeta[] | undefined = LocalityProfileFields;
/** This operation has no query plan, so no paging is known. */
export const getLocalityPage: PageNames | undefined = undefined;

/** Values for each input port of Get Locality. */
export type GetLocalityPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  featureId?: string;
  languageCode?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getLocalityRequest(ports: GetLocalityPorts = {}): ClientInput {
  return {
    params: {
      featureId: String(ports.featureId),
    },
    query: {
      ...ports.input,
      languageCode: ports.languageCode,
    },
  };
}

/**
 * The same place document for a known feature, for visitors who pick a place by name instead of position.
 *
 * GET /v1/locality/{featureId}. Used when no operation.client pack is bound.
 */
export async function getLocality(
  input: ClientInput = {},
): Promise<ClientResponse<LocalityProfile>> {
  const path = "/v1/locality/{featureId}".replace(
    "{featureId}",
    encodeURIComponent(input.params?.["featureId"] ?? ""),
  );
  return send("GET", path, input);
}
