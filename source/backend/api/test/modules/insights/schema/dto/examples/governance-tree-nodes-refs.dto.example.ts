import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of GovernanceTreeNodesRefs, for generated tests. */
export const governanceTreeNodesRefsExample: ContractExample = contractExample({
  name: "GovernanceTreeNodesRefs",
  fields: [
    {
      name: "appointment",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "basis",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "code",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "institution",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "office",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "scheme",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "table",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "tier",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "value",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
