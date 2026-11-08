import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of ApplyReviewsResponse, for generated tests. */
export const applyReviewsResponseExample: ContractExample = contractExample({
  name: "ApplyReviewsResponse",
  fields: [
    {
      name: "applied",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "detail",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2 },
    },
  ],
  invariants: [
  ],
});