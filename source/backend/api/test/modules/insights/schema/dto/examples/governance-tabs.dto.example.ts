import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { governanceTabsArmsExample } from "@test/modules/insights/schema/dto/examples/governance-tabs-arms.dto.example.ts";
import { governanceTabsTabsExample } from "@test/modules/insights/schema/dto/examples/governance-tabs-tabs.dto.example.ts";

/** The contract shape of GovernanceTabs, for generated tests. */
export const governanceTabsExample: ContractExample = contractExample({
  name: "GovernanceTabs",
  fields: [
    {
      name: "arms",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => governanceTabsArmsExample },
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
      spec: { kind: "schema", example: () => governanceTabsTabsExample },
    },
  ],
  invariants: [],
});
