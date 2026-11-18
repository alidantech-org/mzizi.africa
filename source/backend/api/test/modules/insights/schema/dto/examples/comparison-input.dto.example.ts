import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ComparisonInput, for generated tests. */
export const comparisonInputExample: ContractExample = contractExample({
  name: "ComparisonInput",
  fields: [
    {
      name: "a",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "b",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "metrics",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 1000 },
    },
  ],
  invariants: [],
});
