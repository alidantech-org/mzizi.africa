import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { personNamePublicExample } from "#/modules/person/dto/person-name-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of PersonNamesListResponse, for generated tests. */
export const personNamesListResponseExample: ContractExample = contractExample({
  name: "PersonNamesListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "personNames",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => personNamePublicExample },
    },
  ],
  invariants: [
  ],
});