import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { eventsExample } from "@test/modules/event/schema/dto/examples/events.dto.example.ts";
import { occurrencesExample } from "@test/modules/event/schema/dto/examples/occurrences.dto.example.ts";
import { schedulesExample } from "@test/modules/event/schema/dto/examples/schedules.dto.example.ts";
import { entityExample } from "@test/modules/shared/schema/dto/examples/entity.dto.example.ts";

/** The contract shape of Items, for generated tests. */
export const itemsExample: ContractExample = contractExample({
  name: "Items",
  fields: [
    {
      name: "countsWorkingDays",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "deletedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "eventId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "note",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
    },
    {
      name: "occurrenceId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "offsetDays",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true },
    },
    {
      name: "position",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "scheduleId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
  ],
  invariants: [],
});
