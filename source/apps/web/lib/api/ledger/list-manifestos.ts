import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type ManifestoList, ManifestoListFields } from "#/lib/types/manifesto-list.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listManifestosInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {};
/** Field metadata of the output, when it is a schema. */
export const listManifestosOutputFields: readonly FieldMeta[] | undefined = ManifestoListFields;
/** This operation has no query plan, so no paging is known. */
export const listManifestosPage: PageNames | undefined = undefined;

/** Values for each input port of List Manifestos. */
export type ListManifestosPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listManifestosRequest(ports: ListManifestosPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
    },
  };
}

/**
 * Party and candidate manifestos by election.
 *
 * GET /v1/manifestos. Used when no operation.client pack is bound.
 */
export async function listManifestos(
  input: ClientInput = {},
): Promise<ClientResponse<ManifestoList>> {
  const path = "/v1/manifestos";
  return send("GET", path, input);
}
