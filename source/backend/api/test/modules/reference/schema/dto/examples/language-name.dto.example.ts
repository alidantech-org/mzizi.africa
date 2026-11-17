import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { LanguageNameKind } from "#/modules/reference/schema/enum/language-name-kind.enum.ts";
import { languageExample } from "@test/modules/reference/schema/dto/examples/language.dto.example.ts";
import { entityExample } from "@test/modules/shared/schema/dto/examples/entity.dto.example.ts";

/** The contract shape of LanguageName, for generated tests. */
export const languageNameExample: ContractExample = contractExample({
  name: "LanguageName",
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
      name: "inLanguageId",
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
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "nameKind",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(LanguageNameKind) },
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
