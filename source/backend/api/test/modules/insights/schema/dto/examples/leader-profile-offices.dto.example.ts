import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of LeaderProfileOffices, for generated tests. */
export const leaderProfileOfficesExample: ContractExample = contractExample({
  name: "LeaderProfileOffices",
  fields: [
    {
      name: "holderId",
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
      name: "leftOfficeOn",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "office",
      optional: false,
      nullable: false,
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
  ],
  invariants: [],
});
