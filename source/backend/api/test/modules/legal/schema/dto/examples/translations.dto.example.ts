import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { ReviewStatus } from "#/modules/legal/schema/enum/review-status.enum.ts";
import { TranslationMethod } from "#/modules/legal/schema/enum/translation-method.enum.ts";
import { wordingsExample } from "@test/modules/legal/schema/dto/examples/wordings.dto.example.ts";
import { languageExample } from "@test/modules/reference/schema/dto/examples/language.dto.example.ts";
import { codedEntityExample } from "@test/modules/shared/schema/dto/examples/coded-entity.dto.example.ts";

/** The contract shape of Translations, for generated tests. */
export const translationsExample: ContractExample = contractExample({
  name: "Translations",
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
      name: "id",
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
      name: "method",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(TranslationMethod) },
    },
    {
      name: "notes",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
    },
    {
      name: "producedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "producedBy",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "json" },
    },
    {
      name: "reviewStatus",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(ReviewStatus) },
    },
    {
      name: "reviewedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "reviewedBySnapshot",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "json" },
    },
    {
      name: "text",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1 },
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
  invariants: [],
});
