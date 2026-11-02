import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { observationDerivationPublicExample } from "#/modules/statistics/dto/observation-derivation-public.dto.example.ts";

/** The contract shape of ObservationDerivationsListResponse, for generated tests. */
export const observationDerivationsListResponseExample: ContractExample = contractExample({
  name: "ObservationDerivationsListResponse",
  fields: [
    {
      name: "derivations",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => observationDerivationPublicExample },
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