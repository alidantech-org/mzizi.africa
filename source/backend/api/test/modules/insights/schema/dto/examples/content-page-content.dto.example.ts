import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { contentPageContentCategoryExample } from "@test/modules/insights/schema/dto/examples/content-page-content-category.dto.example.ts";
import { contentPageContentFrontMatterExample } from "@test/modules/insights/schema/dto/examples/content-page-content-front-matter.dto.example.ts";
import { contentPageContentSubjectExample } from "@test/modules/insights/schema/dto/examples/content-page-content-subject.dto.example.ts";
import { institutionDetailContentClassificationExample } from "@test/modules/insights/schema/dto/examples/institution-detail-content-classification.dto.example.ts";

/** The contract shape of ContentPageContent, for generated tests. */
export const contentPageContentExample: ContractExample = contractExample({
  name: "ContentPageContent",
  fields: [
    {
      name: "body",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "category",
      optional: false,
      nullable: false,
      spec: {
        kind: "schema",
        example: () => contentPageContentCategoryExample,
      },
    },
    {
      name: "classification",
      optional: true,
      nullable: true,
      spec: {
        kind: "schema",
        example: () => institutionDetailContentClassificationExample,
      },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "frontMatter",
      optional: false,
      nullable: false,
      spec: {
        kind: "schema",
        example: () => contentPageContentFrontMatterExample,
      },
    },
    {
      name: "image",
      optional: true,
      nullable: true,
      spec: { kind: "string" },
    },
    {
      name: "isDevelopmentText",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "language",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "slug",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "subject",
      optional: false,
      nullable: false,
      spec: { kind: "schema", example: () => contentPageContentSubjectExample },
    },
    {
      name: "summary",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "tags",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string" },
    },
    {
      name: "title",
      optional: false,
      nullable: false,
      spec: { kind: "string" },
    },
    {
      name: "unresolvedMedia",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "string" },
    },
  ],
  invariants: [],
});
