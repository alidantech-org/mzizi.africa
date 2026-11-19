import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { contentListItemsCategoryExample } from "@test/modules/insights/schema/dto/examples/content-list-items-category.dto.example.ts";
import { contentListItemsClassificationExample } from "@test/modules/insights/schema/dto/examples/content-list-items-classification.dto.example.ts";
import { contentListItemsFrontMatterExample } from "@test/modules/insights/schema/dto/examples/content-list-items-front-matter.dto.example.ts";
import { contentListItemsSubjectExample } from "@test/modules/insights/schema/dto/examples/content-list-items-subject.dto.example.ts";

/** The contract shape of ContentListItems, for generated tests. */
export const contentListItemsExample: ContractExample = contractExample({
  name: "ContentListItems",
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
      spec: { kind: "schema", example: () => contentListItemsCategoryExample },
    },
    {
      name: "classification",
      optional: false,
      nullable: false,
      spec: {
        kind: "schema",
        example: () => contentListItemsClassificationExample,
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
        example: () => contentListItemsFrontMatterExample,
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
      spec: { kind: "schema", example: () => contentListItemsSubjectExample },
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
