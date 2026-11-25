import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { ReviewStatus } from "#/modules/legal/schema/enum/review-status.enum.ts";
import { identitiesExample } from "@test/modules/identity/schema/dto/examples/identities.dto.example.ts";
import { wordingsExample } from "@test/modules/legal/schema/dto/examples/wordings.dto.example.ts";
import { languagesExample } from "@test/modules/reference/schema/dto/examples/languages.dto.example.ts";
import { codedEntityExample } from "@test/modules/shared/schema/dto/examples/coded-entity.dto.example.ts";
import { termsExample } from "@test/modules/vocabulary/schema/dto/examples/terms.dto.example.ts";

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
      name: "identityId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "kindTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "note",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 4000 },
    },
    {
      name: "noteLanguageId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "reviewStatus",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(ReviewStatus) },
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
    {
      any: true,
      comparisons: [
        {
          left: { field: "note" },
          operator: "equal",
          right: { literal: null },
        },
        {
          left: { field: "noteLanguageId" },
          operator: "not-equal",
          right: { literal: null },
        },
      ],
    },
  ],
});
