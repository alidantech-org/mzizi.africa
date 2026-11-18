import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { type DataListPage, DataListPageFields } from "#/lib/types/data-list-page.ts";
import { ListInputFields } from "#/lib/types/list-input.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getDataListPageInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: ListInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getDataListPageOutputFields: readonly FieldMeta[] | undefined = DataListPageFields;
/** This operation has no query plan, so no paging is known. */
export const getDataListPagePage: PageNames | undefined = undefined;

/** Values for each input port of Get Data List Page. */
export type GetDataListPagePorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  domain?: string;
  code?: string;
  limit?: number;
  offset?: number;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getDataListPageRequest(ports: GetDataListPagePorts = {}): ClientInput {
  return {
    params: {
      domain: String(ports.domain),
      code: String(ports.code),
    },
    query: {
      ...ports.input,
      limit: ports.limit,
      offset: ports.offset,
    },
  };
}

/**
 * One page of a curated data list.
 *
 * GET /v1/explore/db/lists/{domain}/{code}. Used when no operation.client pack is bound.
 */
export async function getDataListPage(
  input: ClientInput = {},
): Promise<ClientResponse<DataListPage>> {
  const path = "/v1/explore/db/lists/{domain}/{code}"
    .replace("{domain}", encodeURIComponent(input.params?.["domain"] ?? ""))
    .replace("{code}", encodeURIComponent(input.params?.["code"] ?? ""));
  return send("GET", path, input);
}
