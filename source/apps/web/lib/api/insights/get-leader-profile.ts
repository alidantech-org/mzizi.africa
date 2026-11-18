import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { IdInputFields } from "#/lib/types/id-input.ts";
import { type LeaderProfile, LeaderProfileFields } from "#/lib/types/leader-profile.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getLeaderProfileInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: IdInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getLeaderProfileOutputFields: readonly FieldMeta[] | undefined = LeaderProfileFields;
/** This operation has no query plan, so no paging is known. */
export const getLeaderProfilePage: PageNames | undefined = undefined;

/** Values for each input port of Get Leader Profile. */
export type GetLeaderProfilePorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  id?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getLeaderProfileRequest(ports: GetLeaderProfilePorts = {}): ClientInput {
  return {
    params: {
      id: String(ports.id),
    },
    query: {
      ...ports.input,
    },
  };
}

/**
 * A leader: offices, contacts, media, voting and attendance record, the fund they oversee and evidence.
 *
 * GET /v1/leaders/{id}. Used when no operation.client pack is bound.
 */
export async function getLeaderProfile(
  input: ClientInput = {},
): Promise<ClientResponse<LeaderProfile>> {
  const path = "/v1/leaders/{id}".replace("{id}", encodeURIComponent(input.params?.["id"] ?? ""));
  return send("GET", path, input);
}
