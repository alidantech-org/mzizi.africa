import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { electionPublicExample } from "#/modules/elections/dto/election-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of ElectionsListResponse, for generated tests. */
export const electionsListResponseExample: ContractExample = contractExample({
  name: "ElectionsListResponse",
  fields: [
    {
      name: "elections",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => electionPublicExample },
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