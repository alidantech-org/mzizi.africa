import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { articleEntryTitlesExample } from "@test/modules/media/schema/dto/examples/article-entry-titles.dto.example.ts";

/** The contract shape of ArticleEntry, for generated tests. */
export const articleEntryExample: ContractExample = contractExample({
  name: "ArticleEntry",
  fields: [
    {
      name: "articleId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "categoryTerm",
      optional: false,
      nullable: false,
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
      name: "publishedAt",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "titles",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => articleEntryTitlesExample },
    },
  ],
  invariants: [],
});
