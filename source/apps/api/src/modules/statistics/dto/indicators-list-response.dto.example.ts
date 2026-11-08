import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { indicatorPublicExample } from "#/modules/statistics/dto/indicator-public.dto.example.ts";

/** The contract shape of IndicatorsListResponse, for generated tests. */
export const indicatorsListResponseExample: ContractExample = contractExample({
  name: "IndicatorsListResponse",
  fields: [
    {
      name: "indicators",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => indicatorPublicExample },
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