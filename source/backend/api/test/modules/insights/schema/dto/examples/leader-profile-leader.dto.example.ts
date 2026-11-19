import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of LeaderProfileLeader, for generated tests. */
export const leaderProfileLeaderExample: ContractExample = contractExample({
  name: "LeaderProfileLeader",
  fields: [
    {
      name: "birthDate",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "holderId",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "individualId",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "institution",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "leaderSlug",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "office",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "party",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "tookOfficeOn",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "unit",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "unitId",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "unitPath",
      optional: true,
      nullable: false,
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
