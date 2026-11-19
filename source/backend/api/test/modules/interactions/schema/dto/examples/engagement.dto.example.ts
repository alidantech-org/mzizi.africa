import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of Engagement, for generated tests. */
export const engagementExample: ContractExample = contractExample({
  name: "Engagement",
  fields: [
    {
      name: "liked",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "likes",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
  ],
  invariants: [],
});
