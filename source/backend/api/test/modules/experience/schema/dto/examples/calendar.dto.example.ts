import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { calendarEventExample } from "@test/modules/experience/schema/dto/examples/calendar-event.dto.example.ts";
import { countdownExample } from "@test/modules/experience/schema/dto/examples/countdown.dto.example.ts";

/** The contract shape of Calendar, for generated tests. */
export const calendarExample: ContractExample = contractExample({
  name: "Calendar",
  fields: [
    {
      name: "events",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => calendarEventExample },
    },
    {
      name: "from",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "gaps",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "next",
      optional: true,
      nullable: true,
      spec: { kind: "schema", example: () => countdownExample },
    },
    {
      name: "to",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date" },
    },
  ],
  invariants: [],
});
