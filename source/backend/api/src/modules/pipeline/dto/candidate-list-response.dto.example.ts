import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { candidateSummaryExample } from "#/modules/pipeline/dto/candidate-summary.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of CandidateListResponse, for generated tests. */
export const candidateListResponseExample: ContractExample = contractExample({
  name: "CandidateListResponse",
  fields: [
    {
      name: "candidates",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => candidateSummaryExample },
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