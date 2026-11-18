import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { CodeInputFields } from "#/lib/types/code-input.ts";
import { type InstitutionDetail, InstitutionDetailFields } from "#/lib/types/institution-detail.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getInstitutionInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: CodeInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getInstitutionOutputFields: readonly FieldMeta[] | undefined = InstitutionDetailFields;
/** This operation has no query plan, so no paging is known. */
export const getInstitutionPage: PageNames | undefined = undefined;

/** Values for each input port of Get Institution. */
export type GetInstitutionPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  code?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getInstitutionRequest(ports: GetInstitutionPorts = {}): ClientInput {
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
 * One body: what it is for, what created it (with the Constitution articles or Acts), who leads it, the bodies it belongs to and oversees, and explanatory texts.
 *
 * GET /v1/institutions/{code}. Used when no operation.client pack is bound.
 */
export async function getInstitution(
  input: ClientInput = {},
): Promise<ClientResponse<InstitutionDetail>> {
  const path = "/v1/institutions/{code}".replace(
    "{code}",
    encodeURIComponent(input.params?.["code"] ?? ""),
  );
  return send("GET", path, input);
}
