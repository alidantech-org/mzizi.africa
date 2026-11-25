import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { eventsExample } from "@test/modules/event/schema/dto/examples/events.dto.example.ts";
import { identitiesExample } from "@test/modules/identity/schema/dto/examples/identities.dto.example.ts";
import { timezonesExample } from "@test/modules/reference/schema/dto/examples/timezones.dto.example.ts";
import { codedEntityExample } from "@test/modules/shared/schema/dto/examples/coded-entity.dto.example.ts";
import { termsExample } from "@test/modules/vocabulary/schema/dto/examples/terms.dto.example.ts";

/** The contract shape of Occurrences, for generated tests. */
export const occurrencesExample: ContractExample = contractExample({
  name: "Occurrences",
  fields: [
    {
      name: "actualEndsOn",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "actualStartsOn",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: {
        kind: "string",
        minLength: 1,
        maxLength: 255,
        patterns: [
          "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ],
      },
    },
    {
      name: "continuesOccurrenceId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
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
      name: "formatTerm",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "isAllDay",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "knowledgeTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "organiserId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "plannedEndsOn",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "plannedStartsOn",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "startsAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "statusTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "timezoneId",
      optional: true,
      nullable: true,
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
  invariants: [
    {
      any: true,
      comparisons: [
        {
          left: { field: "plannedStartsOn" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "plannedEndsOn" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "plannedStartsOn" },
          operator: "less-than-or-equal",
          right: { field: "plannedEndsOn" },
        },
      ],
    },
    {
      any: true,
      comparisons: [
        {
          left: { field: "actualStartsOn" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "actualEndsOn" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "actualStartsOn" },
          operator: "less-than-or-equal",
          right: { field: "actualEndsOn" },
        },
      ],
    },
  ],
});
