import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { electionResultPublicExample } from "#/modules/elections/dto/election-result-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of ElectionResultsListResponse, for generated tests. */
export const electionResultsListResponseExample: ContractExample = contractExample({
  name: "ElectionResultsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "results",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => electionResultPublicExample },
    },
  ],
  invariants: [
  ],
});