import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import {
  type MotionList,
  MotionListFields,
} from "#/_archives/lib/types/motion-list";
import {
  type MotionsInput,
  MotionsInputFields,
} from "#/_archives/lib/types/motions-input";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const listMotionsInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  input: MotionsInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const listMotionsOutputFields: readonly FieldMeta[] | undefined =
  MotionListFields;
/** This operation has no query plan, so no paging is known. */
export const listMotionsPage: PageNames | undefined = undefined;

/** Values for each input port of List Motions. */
export type ListMotionsPorts = {
  input?: MotionsInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function listMotionsRequest(ports: ListMotionsPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...(ports.input as Record<string, unknown> | undefined),
    },
  };
}

/**
 * Motions, bills and decisions of public bodies, newest first.
 *
 * GET /v1/motions. Used when no operation.client pack is bound.
 */
export async function listMotions(
  input: ClientInput = {},
): Promise<ClientResponse<MotionList>> {
  const path = "/v1/motions";
  return send("GET", path, input);
}
