import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { CodeInputFields } from "#/lib/types/code-input.ts";
import { type MotionDetail, MotionDetailFields } from "#/lib/types/motion-detail.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getMotionInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: CodeInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getMotionOutputFields: readonly FieldMeta[] | undefined = MotionDetailFields;
/** This operation has no query plan, so no paging is known. */
export const getMotionPage: PageNames | undefined = undefined;

/** Values for each input port of Get Motion. */
export type GetMotionPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  code?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getMotionRequest(ports: GetMotionPorts = {}): ClientInput {
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
 * One motion with the position of every member (yes, no, abstained, absent), the law or budget it concerns and the tally.
 *
 * GET /v1/motions/{code}. Used when no operation.client pack is bound.
 */
export async function getMotion(input: ClientInput = {}): Promise<ClientResponse<MotionDetail>> {
  const path = "/v1/motions/{code}".replace(
    "{code}",
    encodeURIComponent(input.params?.["code"] ?? ""),
  );
  return send("GET", path, input);
}
