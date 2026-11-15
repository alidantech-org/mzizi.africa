import { type ContractExample, contractExample } from "#/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of Captures, for generated tests. */
export const capturesExample: ContractExample = contractExample({
  name: "Captures",
  fields: [
    {
      name: "contentHash",
      optional: false,
      nullable: false,
      spec: { kind: "string", exactLength: 64, patterns: ["^[a-f0-9]{64}$"] },
    },
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
      name: "documentId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "fileVersionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "manifestReleaseId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "responseMetadata",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "json" },
    },
    {
      name: "retrievedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "retrievedUrl",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "url", maxLength: 2048 },
    },
    {
      name: "sourceId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
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
  invariants: [
  ],
});