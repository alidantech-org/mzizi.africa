import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { baseEntityExample } from "#/modules/shared/dto/base-entity.dto.example.ts";
import { siteExample } from "#/modules/website/dto/site.dto.example.ts";

/** The contract shape of DocumentSighting, for generated tests. */
export const documentSightingExample: ContractExample = contractExample({
  name: "DocumentSighting",
  fields: [
    {
      name: "captureId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "contentHash",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 64, maxLength: 64 },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "depth",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "documentId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "headers",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1 },
    },
    {
      name: "httpStatus",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 100, max: 599 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "pageUrl",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "url", maxLength: 1000 },
    },
    {
      name: "ruleIndex",
      optional: true,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "sectionLabel",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 2, maxLength: 60 },
    },
    {
      name: "seenAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "siteId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "sizeBytes",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "structureVersionId",
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
      name: "url",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "url", maxLength: 1000 },
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