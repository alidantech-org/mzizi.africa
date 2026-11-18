import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type LegalBasisInput, LegalBasisInputFields } from "#/lib/types/legal-basis-input.ts";
import { type LegalBasis, LegalBasisFields } from "#/lib/types/legal-basis.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getLegalBasisInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: LegalBasisInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getLegalBasisOutputFields: readonly FieldMeta[] | undefined = LegalBasisFields;
/** This operation has no query plan, so no paging is known. */
export const getLegalBasisPage: PageNames | undefined = undefined;

/** Values for each input port of Get Legal Basis. */
export type GetLegalBasisPorts = {
  input?: LegalBasisInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getLegalBasisRequest(ports: GetLegalBasisPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * The Constitution articles and Acts that establish, authorise or govern one record (a body, an office, a place).
 *
 * GET /v1/legal-basis. Used when no operation.client pack is bound.
 */
export async function getLegalBasis(input: ClientInput = {}): Promise<ClientResponse<LegalBasis>> {
  const path = "/v1/legal-basis";
  return send("GET", path, input);
}
