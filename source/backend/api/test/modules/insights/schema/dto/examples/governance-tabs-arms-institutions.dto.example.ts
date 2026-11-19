import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { governanceTabsArmsInstitutionsKindExample } from "@test/modules/insights/schema/dto/examples/governance-tabs-arms-institutions-kind.dto.example.ts";

/** The contract shape of GovernanceTabsArmsInstitutions, for generated tests. */
export const governanceTabsArmsInstitutionsExample: ContractExample = contractExample({
  name: "GovernanceTabsArmsInstitutions",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "image",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "kind",
      optional: false,
      nullable: false,
      spec: {
        kind: "schema",
        example: () => governanceTabsArmsInstitutionsKindExample,
      },
    },
    {
      name: "leaders",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
