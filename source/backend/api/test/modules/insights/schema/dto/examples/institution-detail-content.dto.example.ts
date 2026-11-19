import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { institutionDetailContentCategoryExample } from "@test/modules/insights/schema/dto/examples/institution-detail-content-category.dto.example.ts";
import { institutionDetailContentClassificationExample } from "@test/modules/insights/schema/dto/examples/institution-detail-content-classification.dto.example.ts";
import { institutionDetailContentFrontMatterExample } from "@test/modules/insights/schema/dto/examples/institution-detail-content-front-matter.dto.example.ts";
import { institutionDetailContentSubjectExample } from "@test/modules/insights/schema/dto/examples/institution-detail-content-subject.dto.example.ts";

/** The contract shape of InstitutionDetailContent, for generated tests. */
export const institutionDetailContentExample: ContractExample = contractExample({
  name: "InstitutionDetailContent",
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
        example: () => institutionDetailContentCategoryExample,
      },
    },
    {
      name: "classification",
      optional: false,
      nullable: false,
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
        example: () => institutionDetailContentFrontMatterExample,
      },
    },
    {
      name: "image",
      optional: false,
      nullable: false,
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
      spec: {
        kind: "schema",
        example: () => institutionDetailContentSubjectExample,
      },
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
