import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { countdownMilestoneExample } from "@test/modules/experience/schema/dto/examples/countdown-milestone.dto.example.ts";
import { recurrenceRuleExample } from "@test/modules/experience/schema/dto/examples/recurrence-rule.dto.example.ts";

/** The contract shape of Countdown, for generated tests. */
export const countdownExample: ContractExample = contractExample({
  name: "Countdown",
  fields: [
    {
      name: "daysAway",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true },
    },
    {
      name: "eventCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "knowledgeCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "knowledgeLabel",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "milestones",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => countdownMilestoneExample },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "plannedOn",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "rule",
      optional: true,
      nullable: true,
      spec: { kind: "schema", example: () => recurrenceRuleExample },
    },
  ],
  invariants: [],
});
