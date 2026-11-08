import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { jurisdictionPublicExample } from "#/modules/reference/dto/jurisdiction-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of JurisdictionsListResponse, for generated tests. */
export const jurisdictionsListResponseExample: ContractExample = contractExample({
  name: "JurisdictionsListResponse",
  fields: [
    {
      name: "jurisdictions",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => jurisdictionPublicExample },
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