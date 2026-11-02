import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { partyIdeologyPublicExample } from "#/modules/political/dto/party-ideology-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of PartyIdeologiesListResponse, for generated tests. */
export const partyIdeologiesListResponseExample: ContractExample = contractExample({
  name: "PartyIdeologiesListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "partyIdeologies",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => partyIdeologyPublicExample },
    },
  ],
  invariants: [
  ],
});