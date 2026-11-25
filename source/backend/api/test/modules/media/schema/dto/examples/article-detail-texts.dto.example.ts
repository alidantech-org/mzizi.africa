import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { TextOrigin } from "#/modules/media/schema/enum/text-origin.enum.ts";
import { TextStatus } from "#/modules/media/schema/enum/text-status.enum.ts";

/** The contract shape of ArticleDetailTexts, for generated tests. */
export const articleDetailTextsExample: ContractExample = contractExample({
  name: "ArticleDetailTexts",
  fields: [
    {
      name: "body",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1 },
    },
    {
      name: "languageCode",
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
      name: "origin",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(TextOrigin) },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(TextStatus) },
    },
    {
      name: "summary",
      optional: false,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 4000 },
    },
    {
      name: "title",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
  ],
  invariants: [],
});
