import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { fileVersionPublicExample } from "#/modules/filesystem/dto/file-version-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of FileVersionsListResponse, for generated tests. */
export const fileVersionsListResponseExample: ContractExample = contractExample({
  name: "FileVersionsListResponse",
  fields: [
    {
      name: "meta",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => paginationMetaExample },
    },
    {
      name: "versions",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => fileVersionPublicExample },
    },
  ],
  invariants: [
  ],
});