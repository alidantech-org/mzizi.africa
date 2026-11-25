import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { articleDetailTextsExample } from "@test/modules/media/schema/dto/examples/article-detail-texts.dto.example.ts";

/** The contract shape of ArticleDetail, for generated tests. */
export const articleDetailExample: ContractExample = contractExample({
  name: "ArticleDetail",
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
      name: "identityId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "publishedAt",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "texts",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => articleDetailTextsExample },
    },
  ],
  invariants: [],
});
