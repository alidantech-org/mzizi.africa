import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of LeaderboardRow, for generated tests. */
export const leaderboardRowExample: ContractExample = contractExample({
  name: "LeaderboardRow",
  fields: [
    {
      name: "detail",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "featureId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "rank",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "share",
      optional: true,
      nullable: true,
      spec: { kind: "number" },
    },
    {
      name: "subjectId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "value",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
