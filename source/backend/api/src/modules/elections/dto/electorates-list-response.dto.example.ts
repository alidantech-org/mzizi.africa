import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { electoratePublicExample } from "#/modules/elections/dto/electorate-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of ElectoratesListResponse, for generated tests. */
export const electoratesListResponseExample: ContractExample = contractExample({
  name: "ElectoratesListResponse",
  fields: [
    {
      name: "electorates",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => electoratePublicExample },
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