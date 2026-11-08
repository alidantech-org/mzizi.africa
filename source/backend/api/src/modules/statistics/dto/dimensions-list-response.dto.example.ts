import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { dimensionPublicExample } from "#/modules/statistics/dto/dimension-public.dto.example.ts";

/** The contract shape of DimensionsListResponse, for generated tests. */
export const dimensionsListResponseExample: ContractExample = contractExample({
  name: "DimensionsListResponse",
  fields: [
    {
      name: "dimensions",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => dimensionPublicExample },
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