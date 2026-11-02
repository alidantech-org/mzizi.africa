import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { observationDimensionPublicExample } from "#/modules/statistics/dto/observation-dimension-public.dto.example.ts";

/** The contract shape of ObservationDimensionsListResponse, for generated tests. */
export const observationDimensionsListResponseExample: ContractExample = contractExample({
  name: "ObservationDimensionsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "observationDimensions",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => observationDimensionPublicExample },
    },
  ],
  invariants: [
  ],
});