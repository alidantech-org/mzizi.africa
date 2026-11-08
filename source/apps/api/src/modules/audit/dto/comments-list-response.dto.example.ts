import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { commentPublicExample } from "#/modules/audit/dto/comment-public.dto.example.ts";
import { paginatedResponseExample } from "#/modules/shared/dto/paginated-response.dto.example.ts";
import { paginationMetaExample } from "#/modules/shared/dto/pagination-meta.dto.example.ts";

/** The contract shape of CommentsListResponse, for generated tests. */
export const commentsListResponseExample: ContractExample = contractExample({
  name: "CommentsListResponse",
  fields: [
    {
      name: "comments",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => commentPublicExample },
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