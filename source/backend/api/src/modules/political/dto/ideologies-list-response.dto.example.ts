import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { ideologyPublicExample } from "#/modules/political/dto/ideology-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of IdeologiesListResponse, for generated tests. */
export const ideologiesListResponseExample: ContractExample = contractExample({
  name: "IdeologiesListResponse",
  fields: [
    {
      name: "ideologies",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => ideologyPublicExample },
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