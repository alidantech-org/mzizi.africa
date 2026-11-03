import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { referendumResultPublicExample } from "#/modules/elections/dto/referendum-result-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of ReferendumResultsListResponse, for generated tests. */
export const referendumResultsListResponseExample: ContractExample = contractExample({
  name: "ReferendumResultsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "referendumResults",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => referendumResultPublicExample },
    },
  ],
  invariants: [
  ],
});