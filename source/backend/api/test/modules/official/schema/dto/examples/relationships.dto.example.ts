import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import { entitiesExample } from "@test/modules/official/schema/dto/examples/entities.dto.example.ts";
import { individualsExample } from "@test/modules/official/schema/dto/examples/individuals.dto.example.ts";
import { valueExample } from "@test/modules/reference/schema/dto/examples/value.dto.example.ts";
import { codedPeriodEntityExample } from "@test/modules/shared/schema/dto/examples/coded-period-entity.dto.example.ts";
import { citationsExample } from "@test/modules/source/schema/dto/examples/citations.dto.example.ts";

/** The contract shape of Relationships, for generated tests. */
export const relationshipsExample: ContractExample = contractExample({
  name: "Relationships",
  fields: [
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
      name: "endsOn",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "fromEntityId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "fromIndividualId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
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
      name: "kindId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "sharePercentage",
      optional: true,
      nullable: true,
      spec: { kind: "number", min: 0, max: 100 },
    },
    {
      name: "sourceCitationId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "startsOn",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "toEntityId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "toIndividualId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
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
    {
      any: false,
      comparisons: [
        {
          left: { field: "fromEntityId" },
          operator: "not-equal",
          right: { field: "toEntityId" },
        },
        {
          left: { field: "fromIndividualId" },
          operator: "not-equal",
          right: { field: "toIndividualId" },
        },
      ],
    },
  ],
});
