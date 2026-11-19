import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { governanceTabsArmsInstitutionsExample } from "@test/modules/insights/schema/dto/examples/governance-tabs-arms-institutions.dto.example.ts";

/** The contract shape of GovernanceTabsArms, for generated tests. */
export const governanceTabsArmsExample: ContractExample = contractExample({
  name: "GovernanceTabsArms",
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
      name: "institutions",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => governanceTabsArmsInstitutionsExample,
      },
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
