import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { ReviewStatus } from "#/modules/legal/schema/enum/review-status.enum.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum.ts";
import { wordingsExample } from "@test/modules/legal/schema/dto/examples/wordings.dto.example.ts";
import { valueExample } from "@test/modules/reference/schema/dto/examples/value.dto.example.ts";
import { codedPeriodSubjectEntityExample } from "@test/modules/shared/schema/dto/examples/coded-period-subject-entity.dto.example.ts";

/** The contract shape of Effects, for generated tests. */
export const effectsExample: ContractExample = contractExample({
  name: "Effects",
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
      name: "effectiveOn",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "endedOn",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "explanation",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
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
      name: "observedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "reviewStatus",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(ReviewStatus) },
    },
    {
      name: "subjectId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "subjectTable",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(SubjectTable) },
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
    {
      name: "wordingId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
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
          left: { field: "effectiveOn" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "endedOn" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "effectiveOn" },
          operator: "less-than-or-equal",
          right: { field: "endedOn" },
        },
      ],
    },
  ],
});
