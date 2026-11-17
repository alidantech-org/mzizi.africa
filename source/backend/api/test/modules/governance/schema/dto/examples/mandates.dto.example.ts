import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import { institutionsExample } from "@test/modules/governance/schema/dto/examples/institutions.dto.example.ts";
import { officesExample } from "@test/modules/governance/schema/dto/examples/offices.dto.example.ts";
import { valueExample } from "@test/modules/reference/schema/dto/examples/value.dto.example.ts";
import { periodEntityExample } from "@test/modules/shared/schema/dto/examples/period-entity.dto.example.ts";
import { citationsExample } from "@test/modules/source/schema/dto/examples/citations.dto.example.ts";

/** The contract shape of Mandates, for generated tests. */
export const mandatesExample: ContractExample = contractExample({
  name: "Mandates",
  fields: [
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
      name: "description",
      optional: false,
      nullable: false,
      spec: { kind: "string", maxLength: 4000 },
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
      name: "institutionId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "mandateKindId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "officeId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
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
