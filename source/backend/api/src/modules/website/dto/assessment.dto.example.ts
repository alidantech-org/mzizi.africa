import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { AccessBasis } from "#/types/website/access-basis.enum.ts";
import { AssessmentSourceType } from "#/types/website/assessment-source-type.enum.ts";
import { LegalReviewStatus } from "#/types/website/legal-review-status.enum.ts";
import { baseEntityExample } from "#/modules/shared/dto/base-entity.dto.example.ts";
import { siteExample } from "#/modules/website/dto/site.dto.example.ts";

/** The contract shape of Assessment, for generated tests. */
export const assessmentExample: ContractExample = contractExample({
  name: "Assessment",
  fields: [
    {
      name: "accessBasis",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(AccessBasis) },
    },
    {
      name: "accessConditions",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1 },
    },
    {
      name: "approvedScope",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2 },
    },
    {
      name: "conditions",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 2 },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "evidence",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 2 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "isCurrent",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "jurisdictionId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "lawfulBasis",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
    },
    {
      name: "licenceName",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "licenceUrl",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "url", maxLength: 1000 },
    },
    {
      name: "licenceVersion",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "personalDataCategories",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2 },
    },
    {
      name: "processingPurpose",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
    },
    {
      name: "rationale",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1 },
    },
    {
      name: "reviewDueAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "reviewedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "reviewedBy",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "rightsHolder",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "siteId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "sourceType",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(AssessmentSourceType) },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(LegalReviewStatus) },
    },
    {
      name: "supersedesId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
  ],
  invariants: [
  ],
});