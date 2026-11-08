import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { entityIdentifierPublicExample } from "#/modules/entities/dto/entity-identifier-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of EntityIdentifiersListResponse, for generated tests. */
export const entityIdentifiersListResponseExample: ContractExample = contractExample({
  name: "EntityIdentifiersListResponse",
  fields: [
    {
      name: "identifiers",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => entityIdentifierPublicExample },
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