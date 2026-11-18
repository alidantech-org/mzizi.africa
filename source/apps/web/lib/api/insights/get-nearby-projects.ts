import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type NearbyInput, NearbyInputFields } from "#/lib/types/nearby-input.ts";
import { type NearbyProjects, NearbyProjectsFields } from "#/lib/types/nearby-projects.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getNearbyProjectsInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: NearbyInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getNearbyProjectsOutputFields: readonly FieldMeta[] | undefined = NearbyProjectsFields;
/** This operation has no query plan, so no paging is known. */
export const getNearbyProjectsPage: PageNames | undefined = undefined;

/** Values for each input port of Get Nearby Projects. */
export type GetNearbyProjectsPorts = {
  input?: NearbyInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getNearbyProjectsRequest(ports: GetNearbyProjectsPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * Projects close to a position, nearest first, with status, who built them and the money, so a visitor sees what affects them.
 *
 * GET /v1/projects/near. Used when no operation.client pack is bound.
 */
export async function getNearbyProjects(
  input: ClientInput = {},
): Promise<ClientResponse<NearbyProjects>> {
  const path = "/v1/projects/near";
  return send("GET", path, input);
}
