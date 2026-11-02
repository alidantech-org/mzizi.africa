import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { personProfilePublicExample } from "#/modules/person/dto/person-profile-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of PersonProfilesListResponse, for generated tests. */
export const personProfilesListResponseExample: ContractExample = contractExample({
  name: "PersonProfilesListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "profiles",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => personProfilePublicExample },
    },
  ],
  invariants: [
  ],
});