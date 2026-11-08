import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { partyPositionHolderPublicExample } from "#/modules/political/dto/party-position-holder-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of PartyPositionHoldersListResponse, for generated tests. */
export const partyPositionHoldersListResponseExample: ContractExample = contractExample({
  name: "PartyPositionHoldersListResponse",
  fields: [
    {
      name: "holders",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => partyPositionHolderPublicExample },
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