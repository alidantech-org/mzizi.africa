import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of LeaderProfile, for generated tests. */
export const leaderProfileExample: ContractExample = contractExample({
  name: "LeaderProfile",
  fields: [
    {
      name: "activity",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "contacts",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "election",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "evidence",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "fund",
      optional: true,
      nullable: true,
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
      name: "leader",
      optional: false,
      nullable: false,
      spec: { kind: "unknown" },
    },
    {
      name: "media",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
    {
      name: "offices",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "unknown" },
    },
  ],
  invariants: [],
});
