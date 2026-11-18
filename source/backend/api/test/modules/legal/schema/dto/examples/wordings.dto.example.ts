import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import { editionsExample } from "@test/modules/legal/schema/dto/examples/editions.dto.example.ts";
import { instrumentsExample } from "@test/modules/legal/schema/dto/examples/instruments.dto.example.ts";
import { provisionsExample } from "@test/modules/legal/schema/dto/examples/provisions.dto.example.ts";
import { languageExample } from "@test/modules/reference/schema/dto/examples/language.dto.example.ts";
import { codedPeriodEntityExample } from "@test/modules/shared/schema/dto/examples/coded-period-entity.dto.example.ts";
import { citationsExample } from "@test/modules/source/schema/dto/examples/citations.dto.example.ts";

/** The contract shape of Wordings, for generated tests. */
export const wordingsExample: ContractExample = contractExample({
  name: "Wordings",
  fields: [
    {
      name: "citationId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
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
      name: "editionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "endsOn",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "fromToPrecision",
      optional: true,
      nullable: true,
      spec: { kind: "enum", values: Object.values(DatePrecision) },
    },
    {
      name: "fromYear",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "instrumentId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "languageId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "observedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "provisionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "startsOn",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "supersedesId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "text",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1 },
    },
    {
      name: "toYear",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
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
          left: { field: "fromYear" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "toYear" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "fromYear" },
          operator: "less-than-or-equal",
          right: { field: "toYear" },
        },
      ],
    },
    {
      any: true,
      comparisons: [
        {
          left: { field: "startsOn" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "endsOn" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "startsOn" },
          operator: "less-than-or-equal",
          right: { field: "endsOn" },
        },
      ],
    },
  ],
});
