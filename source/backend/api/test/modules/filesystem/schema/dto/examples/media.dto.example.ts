import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum.ts";
import { fileVersionsExample } from "@test/modules/filesystem/schema/dto/examples/file-versions.dto.example.ts";
import { valueExample } from "@test/modules/reference/schema/dto/examples/value.dto.example.ts";
import { codedSubjectEntityExample } from "@test/modules/shared/schema/dto/examples/coded-subject-entity.dto.example.ts";

/** The contract shape of Media, for generated tests. */
export const mediaExample: ContractExample = contractExample({
  name: "Media",
  fields: [
    {
      name: "altText",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
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
      name: "description",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
    },
    {
      name: "endSecond",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "externalUrl",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "url", maxLength: 2048 },
    },
    {
      name: "fileVersionId",
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
      name: "kindId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "platformId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "position",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "purpose",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
    },
    {
      name: "startSecond",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
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
      name: "thumbnailUrl",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "url", maxLength: 2048 },
    },
    {
      name: "title",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
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
          left: { field: "fileVersionId" },
          operator: "not-equal",
          right: { literal: null },
        },
        {
          left: { field: "externalUrl" },
          operator: "not-equal",
          right: { literal: null },
        },
      ],
    },
    {
      any: true,
      comparisons: [
        {
          left: { field: "startSecond" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "endSecond" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "startSecond" },
          operator: "less-than",
          right: { field: "endSecond" },
        },
      ],
    },
  ],
});
