import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type LocalityProfile, LocalityProfileFields } from "#/lib/types/locality-profile.ts";
import { type PositionInput, PositionInputFields } from "#/lib/types/position-input.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const resolveLocalityInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: PositionInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const resolveLocalityOutputFields: readonly FieldMeta[] | undefined = LocalityProfileFields;
/** This operation has no query plan, so no paging is known. */
export const resolveLocalityPage: PageNames | undefined = undefined;

/** Values for each input port of Resolve Locality. */
export type ResolveLocalityPorts = {
  input?: PositionInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function resolveLocalityRequest(ports: ResolveLocalityPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * Who and what serves the place at a position: the containing units, the office holders scoped to them, procurement there, media and the evidence for each claim, in the requested language.
 *
 * GET /v1/locality/at. Used when no operation.client pack is bound.
 */
export async function resolveLocality(
  input: ClientInput = {},
): Promise<ClientResponse<LocalityProfile>> {
  const path = "/v1/locality/at";
  return send("GET", path, input);
}
