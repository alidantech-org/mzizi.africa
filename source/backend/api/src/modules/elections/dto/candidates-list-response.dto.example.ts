import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { candidatePublicExample } from "#/modules/elections/dto/candidate-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of CandidatesListResponse, for generated tests. */
export const candidatesListResponseExample: ContractExample = contractExample({
  name: "CandidatesListResponse",
  fields: [
    {
      name: "candidates",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => candidatePublicExample },
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