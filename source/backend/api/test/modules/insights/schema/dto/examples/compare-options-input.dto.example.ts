import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of CompareOptionsInput, for generated tests. */
export const compareOptionsInputExample: ContractExample = contractExample({
  name: "CompareOptionsInput",
  fields: [
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "metric",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
    },
  ],
  invariants: [],
});
