import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of GovernanceTabs, for generated tests. */
export const governanceTabsExample: ContractExample = contractExample({
  name: "GovernanceTabs",
  fields: [
    {
      name: "arms",
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
    {
      name: "tabs",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
  ],
  invariants: [],
});
