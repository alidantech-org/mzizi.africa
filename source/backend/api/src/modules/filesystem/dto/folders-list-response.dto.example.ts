import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { folderPublicExample } from "#/modules/filesystem/dto/folder-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of FoldersListResponse, for generated tests. */
export const foldersListResponseExample: ContractExample = contractExample({
  name: "FoldersListResponse",
  fields: [
    {
      name: "folders",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => folderPublicExample },
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