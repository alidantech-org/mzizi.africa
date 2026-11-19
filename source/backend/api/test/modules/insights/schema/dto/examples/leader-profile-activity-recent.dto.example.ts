import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of LeaderProfileActivityRecent, for generated tests. */
export const leaderProfileActivityRecentExample: ContractExample = contractExample({
  name: "LeaderProfileActivityRecent",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "heldOn",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "outcome",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "position",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "title",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
