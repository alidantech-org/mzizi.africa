import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of RecurrenceRule, for generated tests. */
export const recurrenceRuleExample: ContractExample = contractExample({
  name: "RecurrenceRule",
  fields: [
    {
      name: "dayOfMonth",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "intervalYears",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "kindCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "month",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "nthWeekday",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "rrule",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "weekday",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 1 },
    },
  ],
  invariants: [],
});
