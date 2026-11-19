import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of GovernanceTreeTab, for generated tests. */
export const governanceTreeTabExample: ContractExample = contractExample({
  name: "GovernanceTreeTab",
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
      name: "institution",
      optional: true,
      nullable: true,
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
