import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { partyPublicExample } from "#/modules/political/dto/party-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of PartiesListResponse, for generated tests. */
export const partiesListResponseExample: ContractExample = contractExample({
  name: "PartiesListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "parties",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => partyPublicExample },
    },
  ],
  invariants: [
  ],
});