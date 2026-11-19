import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of MotionDetailMembers, for generated tests. */
export const motionDetailMembersExample: ContractExample = contractExample({
  name: "MotionDetailMembers",
  fields: [
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
      name: "partyCode",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "position",
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
  ],
  invariants: [],
});
