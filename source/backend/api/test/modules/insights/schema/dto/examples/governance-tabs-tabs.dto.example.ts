import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of GovernanceTabsTabs, for generated tests. */
export const governanceTabsTabsExample: ContractExample = contractExample({
  name: "GovernanceTabsTabs",
  fields: [
    {
      name: "about",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "count",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "includes",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "label",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
