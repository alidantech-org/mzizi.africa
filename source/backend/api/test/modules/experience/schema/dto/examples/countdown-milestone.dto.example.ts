import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of CountdownMilestone, for generated tests. */
export const countdownMilestoneExample: ContractExample = contractExample({
  name: "CountdownMilestone",
  fields: [
    {
      name: "daysAway",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "offsetDays",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true },
    },
    {
      name: "plannedOn",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date" },
    },
  ],
  invariants: [],
});
