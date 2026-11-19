import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { contentPageRelatedCategoryExample } from "@test/modules/insights/schema/dto/examples/content-page-related-category.dto.example.ts";
import { contentPageRelatedFrontMatterExample } from "@test/modules/insights/schema/dto/examples/content-page-related-front-matter.dto.example.ts";
import { contentPageRelatedSubjectExample } from "@test/modules/insights/schema/dto/examples/content-page-related-subject.dto.example.ts";
import { institutionDetailContentClassificationExample } from "@test/modules/insights/schema/dto/examples/institution-detail-content-classification.dto.example.ts";

/** The contract shape of ContentPageRelated, for generated tests. */
export const contentPageRelatedExample: ContractExample = contractExample({
  name: "ContentPageRelated",
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
        example: () => contentPageRelatedCategoryExample,
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
        example: () => contentPageRelatedFrontMatterExample,
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
      spec: { kind: "schema", example: () => contentPageRelatedSubjectExample },
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
