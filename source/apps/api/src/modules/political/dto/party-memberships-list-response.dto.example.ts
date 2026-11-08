import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { partyMembershipPublicExample } from "#/modules/political/dto/party-membership-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of PartyMembershipsListResponse, for generated tests. */
export const partyMembershipsListResponseExample: ContractExample = contractExample({
  name: "PartyMembershipsListResponse",
  fields: [
    {
      name: "memberships",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => partyMembershipPublicExample },
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