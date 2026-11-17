import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  send,
} from "#/lib/dryv/transport.ts";
import { type CapabilityList, CapabilityListFields } from "#/lib/types/capability-list.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listCapabilitiesInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {};
/** Field metadata of the output, when it is a schema. */
export const listCapabilitiesOutputFields: readonly FieldMeta[] | undefined = CapabilityListFields;

/** Values for each input port of List Capabilities. */
export type ListCapabilitiesPorts = {};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listCapabilitiesRequest(ports: ListCapabilitiesPorts = {}): ClientInput {
  return {
    params: {},
    query: {},
  };
}

/**
 * What the engine can run.
 *
 * GET /capabilities. Used when no operation.client pack is bound.
 */
export async function listCapabilities(
  input: ClientInput = {},
): Promise<ClientResponse<CapabilityList>> {
  const path = "/capabilities";
  return send("GET", path, input);
}
