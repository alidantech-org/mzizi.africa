import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PartyDetailMembers, for generated tests. */
export const partyDetailMembersExample: ContractExample = contractExample({
  name: "PartyDetailMembers",
  fields: [
    {
      name: "holderId",
      optional: true,
      nullable: true,
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
      optional: true,
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
      optional: true,
      nullable: true,
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
