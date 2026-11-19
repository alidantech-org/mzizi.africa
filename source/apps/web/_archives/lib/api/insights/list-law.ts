import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import { type LawInput, LawInputFields } from "#/_archives/lib/types/law-input";
import { type LawList, LawListFields } from "#/_archives/lib/types/law-list";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listLawInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  input: LawInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const listLawOutputFields: readonly FieldMeta[] | undefined =
  LawListFields;
/** This operation has no query plan, so no paging is known. */
export const listLawPage: PageNames | undefined = undefined;

/** Values for each input port of List Law. */
export type ListLawPorts = {
  input?: LawInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listLawRequest(ports: ListLawPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * Legal instruments held, highest authority first (constitution, then acts, then regulations), with their size.
 *
 * GET /v1/law. Used when no operation.client pack is bound.
 */
export async function listLaw(
  input: ClientInput = {},
): Promise<ClientResponse<LawList>> {
  const path = "/v1/law";
  return send("GET", path, input);
}
