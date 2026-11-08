import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { entityOwnershipPublicExample } from "#/modules/entities/dto/entity-ownership-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of EntityOwnershipsListResponse, for generated tests. */
export const entityOwnershipsListResponseExample: ContractExample = contractExample({
  name: "EntityOwnershipsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "ownerships",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => entityOwnershipPublicExample },
    },
  ],
  invariants: [
  ],
});