import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { structureVersionPublicExample } from "#/modules/website/dto/structure-version-public.dto.example.ts";

/** The contract shape of StructureVersionsListResponse, for generated tests. */
export const structureVersionsListResponseExample: ContractExample = contractExample({
  name: "StructureVersionsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "structureVersions",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => structureVersionPublicExample },
    },
  ],
  invariants: [
  ],
});