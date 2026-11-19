import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of GovernanceTabsArmsInstitutionsKind, for generated tests. */
export const governanceTabsArmsInstitutionsKindExample: ContractExample = contractExample({
  name: "GovernanceTabsArmsInstitutionsKind",
  fields: [
    {
      name: "code",
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
