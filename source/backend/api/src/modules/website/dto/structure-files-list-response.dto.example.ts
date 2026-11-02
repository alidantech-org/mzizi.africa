import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { structureFilePublicExample } from "#/modules/website/dto/structure-file-public.dto.example.ts";

/** The contract shape of StructureFilesListResponse, for generated tests. */
export const structureFilesListResponseExample: ContractExample = contractExample({
  name: "StructureFilesListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "structureFiles",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => structureFilePublicExample },
    },
  ],
  invariants: [
  ],
});