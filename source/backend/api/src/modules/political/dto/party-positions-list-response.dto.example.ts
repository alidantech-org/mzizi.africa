import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { partyPositionPublicExample } from "#/modules/political/dto/party-position-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of PartyPositionsListResponse, for generated tests. */
export const partyPositionsListResponseExample: ContractExample = contractExample({
  name: "PartyPositionsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "positions",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => partyPositionPublicExample },
    },
  ],
  invariants: [
  ],
});