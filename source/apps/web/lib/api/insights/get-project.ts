import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { CodeInputFields } from "#/lib/types/code-input.ts";
import { type ProjectDetail, ProjectDetailFields } from "#/lib/types/project-detail.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getProjectInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: CodeInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getProjectOutputFields: readonly FieldMeta[] | undefined = ProjectDetailFields;
/** This operation has no query plan, so no paging is known. */
export const getProjectPage: PageNames | undefined = undefined;

/** Values for each input port of Get Project. */
export type GetProjectPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  code?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getProjectRequest(ports: GetProjectPorts = {}): ClientInput {
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
 * One project: where, who is responsible, the money, the procurement, pictures and evidence.
 *
 * GET /v1/projects/{code}. Used when no operation.client pack is bound.
 */
export async function getProject(input: ClientInput = {}): Promise<ClientResponse<ProjectDetail>> {
  const path = "/v1/projects/{code}".replace(
    "{code}",
    encodeURIComponent(input.params?.["code"] ?? ""),
  );
  return send("GET", path, input);
}
