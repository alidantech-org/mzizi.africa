import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of Comparison, for generated tests. */
export const comparisonExample: ContractExample = contractExample({
  name: "Comparison",
  fields: [
    {
      name: "a",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "b",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "rows",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
  ],
  invariants: [],
});
