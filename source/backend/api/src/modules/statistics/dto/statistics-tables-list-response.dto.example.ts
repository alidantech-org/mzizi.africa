import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { statisticsTablePublicExample } from "#/modules/statistics/dto/statistics-table-public.dto.example.ts";

/** The contract shape of StatisticsTablesListResponse, for generated tests. */
export const statisticsTablesListResponseExample: ContractExample = contractExample({
  name: "StatisticsTablesListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "tables",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => statisticsTablePublicExample },
    },
  ],
  invariants: [
  ],
});