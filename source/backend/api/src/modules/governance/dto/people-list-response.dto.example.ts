import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { personPublicExample } from "#/modules/governance/dto/person-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of PeopleListResponse, for generated tests. */
export const peopleListResponseExample: ContractExample = contractExample({
  name: "PeopleListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "people",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => personPublicExample },
    },
  ],
  invariants: [
  ],
});