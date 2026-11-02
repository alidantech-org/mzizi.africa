import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { dimensionMemberPublicExample } from "#/modules/statistics/dto/dimension-member-public.dto.example.ts";

/** The contract shape of DimensionMembersListResponse, for generated tests. */
export const dimensionMembersListResponseExample: ContractExample = contractExample({
  name: "DimensionMembersListResponse",
  fields: [
    {
      name: "members",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => dimensionMemberPublicExample },
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