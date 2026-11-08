import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of CreateCommentBody, for generated tests. */
export const createCommentBodyExample: ContractExample = contractExample({
  name: "CreateCommentBody",
  fields: [
    {
      name: "body",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1 },
    },
    {
      name: "parentCommentId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "targetId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "targetKind",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 100 },
    },
  ],
  invariants: [
  ],
});