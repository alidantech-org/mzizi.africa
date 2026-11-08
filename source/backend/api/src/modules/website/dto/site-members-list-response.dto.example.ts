import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { siteMemberPublicExample } from "#/modules/website/dto/site-member-public.dto.example.ts";

/** The contract shape of SiteMembersListResponse, for generated tests. */
export const siteMembersListResponseExample: ContractExample = contractExample({
  name: "SiteMembersListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "siteMembers",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => siteMemberPublicExample },
    },
  ],
  invariants: [
  ],
});