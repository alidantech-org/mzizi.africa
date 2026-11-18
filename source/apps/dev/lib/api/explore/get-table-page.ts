import {
  type ClientInput,
  type ClientResponse,
  type FieldMeta,
  type PageNames,
  send,
} from "#/lib/dryv/transport.ts";
import { TableInputFields } from "#/lib/types/table-input.ts";
import { type TablePage, TablePageFields } from "#/lib/types/table-page.ts";

/** Field metadata of the input fields whose value is a schema, by field name. A schema
 * input is listed whole under "input". */
export const getTablePageInputFields: Readonly<Record<string, readonly FieldMeta[]>> = {
  input: TableInputFields,
};
/** Field metadata of the output, when it is a schema. */
export const getTablePageOutputFields: readonly FieldMeta[] | undefined = TablePageFields;
/** This operation has no query plan, so no paging is known. */
export const getTablePagePage: PageNames | undefined = undefined;

/** Values for each input port of Get Table Page. */
export type GetTablePagePorts = {
  /** Query values by field name, for callers (such as the generated list pages) that build them generically. */
  input?: Record<string, unknown>;
  domain?: string;
  table?: string;
  limit?: number;
  offset?: number;
  order?: string;
  direction?: string;
  q?: string;
};

/** Maps port values to the HTTP request parts of the operation.client convention. */
export function getTablePageRequest(ports: GetTablePagePorts = {}): ClientInput {
  return {
    params: {
      domain: String(ports.domain),
      table: String(ports.table),
    },
    query: {
      ...ports.input,
      limit: ports.limit,
      offset: ports.offset,
      order: ports.order,
      direction: ports.direction,
      q: ports.q,
    },
  };
}

/**
 * One page of a raw table, with search and sorting.
 *
 * GET /v1/explore/db/tables/{domain}/{table}. Used when no operation.client pack is bound.
 */
export async function getTablePage(input: ClientInput = {}): Promise<ClientResponse<TablePage>> {
  const path = "/v1/explore/db/tables/{domain}/{table}"
    .replace("{domain}", encodeURIComponent(input.params?.["domain"] ?? ""))
    .replace("{table}", encodeURIComponent(input.params?.["table"] ?? ""));
  return send("GET", path, input);
}
