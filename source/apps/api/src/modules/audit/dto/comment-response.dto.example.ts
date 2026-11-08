import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { commentPublicExample } from "#/modules/audit/dto/comment-public.dto.example.ts";

/** The contract shape of CommentResponse, for generated tests. */
export const commentResponseExample: ContractExample = contractExample({
  name: "CommentResponse",
  fields: [
    {
      name: "comment",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => commentPublicExample },
    },
  ],
  invariants: [
  ],
});