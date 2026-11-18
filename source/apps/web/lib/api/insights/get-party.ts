import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { CodeInputFields } from "#/lib/types/code-input.ts";
import { type PartyDetail, PartyDetailFields } from "#/lib/types/party-detail.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getPartyInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: CodeInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getPartyOutputFields: readonly FieldMeta[] | undefined = PartyDetailFields;
/** This operation has no query plan, so no paging is known. */
export const getPartyPage: PageNames | undefined = undefined;

/** Values for each input port of Get Party. */
export type GetPartyPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  code?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getPartyRequest(ports: GetPartyPorts = {}): ClientInput {
  return {
    params: {
      code: String(ports.code),
    },
    query: {
      ...ports.input,
    },
  };
}

/**
 * One party: members list, votes obtained by election and fund allocation.
 *
 * GET /v1/parties/{code}. Used when no operation.client pack is bound.
 */
export async function getParty(input: ClientInput = {}): Promise<ClientResponse<PartyDetail>> {
  const path = "/v1/parties/{code}".replace(
    "{code}",
    encodeURIComponent(input.params?.["code"] ?? ""),
  );
  return send("GET", path, input);
}
