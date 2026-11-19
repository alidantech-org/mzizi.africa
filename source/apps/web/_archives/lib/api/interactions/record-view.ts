import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/_archives/lib/dryv/transport";
import { type Recorded, RecordedFields } from "#/_archives/lib/types/recorded";
import {
  type ViewInput,
  ViewInputFields,
} from "#/_archives/lib/types/view-input";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const recordViewInputFields: Readonly<
  Record<string, readonly FieldMeta[]>
> = {
  body: ViewInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const recordViewOutputFields: readonly FieldMeta[] | undefined =
  RecordedFields;
/** This operation has no query plan, so no paging is known. */
export const recordViewPage: PageNames | undefined = undefined;

/** Values for each input port of Record View. */
export type RecordViewPorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  body?: ViewInput;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function recordViewRequest(ports: RecordViewPorts = {}): ClientInput {
  return {
    params: {},
    query: {
      ...ports.input,
    },
    body: ports.body,
  };
}

/**
 * A subject was viewed; one view per visitor per day.
 *
 * POST /v1/views. Used when no operation.client pack is bound.
 */
export async function recordView(
  input: ClientInput = {},
): Promise<ClientResponse<Recorded>> {
  const path = "/v1/views";
  return send("POST", path, input);
}
