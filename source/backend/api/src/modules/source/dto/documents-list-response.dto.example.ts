import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";
import { documentPublicExample } from "#/modules/source/dto/document-public.dto.example.ts";

/** The contract shape of DocumentsListResponse, for generated tests. */
export const documentsListResponseExample: ContractExample = contractExample({
  name: "DocumentsListResponse",
  fields: [
    {
      name: "documents",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => documentPublicExample },
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