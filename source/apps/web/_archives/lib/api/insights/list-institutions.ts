import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type InstitutionList,
  InstitutionListFields,
} from "#/_archives/lib/types/institution-list";
import {
  type InstitutionsInput,
  InstitutionsInputFields,
} from "#/_archives/lib/types/institutions-input";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listInstitutionsInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  input: InstitutionsInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const listInstitutionsOutputFields: readonly FieldMeta[] | undefined =
  InstitutionListFields;
/** This operation has no query plan, so no paging is known. */
export const listInstitutionsPage: PageNames | undefined = undefined;

/** Values for each input port of List Institutions. */
export type ListInstitutionsPorts = {
  input?: InstitutionsInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listInstitutionsRequest(
  ports: ListInstitutionsPorts = {},
): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * Every public body grouped by arm of government and kind, with what created it and how many leaders it has. The groups and labels come from the reference schemes.
 *
 * GET /v1/institutions. Used when no operation.client pack is bound.
 */
export async function listInstitutions(
  input: ClientInput = {},
): Promise<ClientResponse<InstitutionList>> {
  const path = "/v1/institutions";
  return send("GET", path, input);
}
