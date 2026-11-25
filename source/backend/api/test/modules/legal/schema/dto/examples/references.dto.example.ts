import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { ReferenceMethod } from "#/modules/legal/schema/enum/reference-method.enum.ts";
import { ReferenceRelation } from "#/modules/legal/schema/enum/reference-relation.enum.ts";
import { ReviewStatus } from "#/modules/legal/schema/enum/review-status.enum.ts";
import { provisionsExample } from "@test/modules/legal/schema/dto/examples/provisions.dto.example.ts";
import { translationsExample } from "@test/modules/legal/schema/dto/examples/translations.dto.example.ts";
import { wordingsExample } from "@test/modules/legal/schema/dto/examples/wordings.dto.example.ts";
import { entityExample } from "@test/modules/shared/schema/dto/examples/entity.dto.example.ts";

/** The contract shape of References, for generated tests. */
export const referencesExample: ContractExample = contractExample({
  name: "References",
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
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "method",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(ReferenceMethod) },
    },
    {
      name: "relation",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(ReferenceRelation) },
    },
    {
      name: "reviewStatus",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(ReviewStatus) },
    },
    {
      name: "spanEnd",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "spanStart",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "spanText",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "targetProvisionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "targetWordingId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "translationId",
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
    {
      name: "wordingId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [
    {
      any: false,
      comparisons: [
        {
          left: { field: "spanStart" },
          operator: "less-than",
          right: { field: "spanEnd" },
        },
      ],
    },
  ],
});
