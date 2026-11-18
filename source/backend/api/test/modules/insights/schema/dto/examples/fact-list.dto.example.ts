import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of FactList, for generated tests. */
export const factListExample: ContractExample = contractExample({
  name: "FactList",
  fields: [
    {
      name: "facts",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
  ],
  invariants: [],
});
