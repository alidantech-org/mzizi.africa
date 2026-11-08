import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of ApplyReviewsQuery, for generated tests. */
export const applyReviewsQueryExample: ContractExample = contractExample({
  name: "ApplyReviewsQuery",
  fields: [
    {
      name: "runId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [
  ],
});