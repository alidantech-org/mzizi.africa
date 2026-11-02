import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { observationPublicExample } from "#/modules/statistics/dto/observation-public.dto.example.ts";

/** The contract shape of ObservationsListResponse, for generated tests. */
export const observationsListResponseExample: ContractExample = contractExample({
  name: "ObservationsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "observations",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => observationPublicExample },
    },
  ],
  invariants: [
  ],
});