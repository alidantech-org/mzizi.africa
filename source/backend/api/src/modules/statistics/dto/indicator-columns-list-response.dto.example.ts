import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { indicatorColumnPublicExample } from "#/modules/statistics/dto/indicator-column-public.dto.example.ts";

/** The contract shape of IndicatorColumnsListResponse, for generated tests. */
export const indicatorColumnsListResponseExample: ContractExample = contractExample({
  name: "IndicatorColumnsListResponse",
  fields: [
    {
      name: "columns",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => indicatorColumnPublicExample },
    },
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
  ],
  invariants: [
  ],
});