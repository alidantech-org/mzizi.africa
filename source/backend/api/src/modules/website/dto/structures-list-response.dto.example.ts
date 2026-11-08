import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { structurePublicExample } from "#/modules/website/dto/structure-public.dto.example.ts";

/** The contract shape of StructuresListResponse, for generated tests. */
export const structuresListResponseExample: ContractExample = contractExample({
  name: "StructuresListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "structures",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => structurePublicExample },
    },
  ],
  invariants: [
  ],
});