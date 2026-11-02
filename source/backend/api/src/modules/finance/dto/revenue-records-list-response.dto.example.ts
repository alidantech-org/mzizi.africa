import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { revenueRecordPublicExample } from "#/modules/finance/dto/revenue-record-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of RevenueRecordsListResponse, for generated tests. */
export const revenueRecordsListResponseExample: ContractExample = contractExample({
  name: "RevenueRecordsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "revenues",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => revenueRecordPublicExample },
    },
  ],
  invariants: [
  ],
});