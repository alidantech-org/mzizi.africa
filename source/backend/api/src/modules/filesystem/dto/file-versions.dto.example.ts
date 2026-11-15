import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { Access } from "#/modules/filesystem/access.enum.ts";

/** The contract shape of FileVersions, for generated tests. */
export const fileVersionsExample: ContractExample = contractExample({
  name: "FileVersions",
  fields: [
    {
      name: "access",
      optional: false,
      nullable: false,
      spec: { kind: "enum", values: Object.values(Access) },
    },
    {
      name: "contentType",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "createdBySnapshot",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "json" },
    },
    {
      name: "deletedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "fileExtensionId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "fileId",
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
      name: "originalFilename",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
    {
      name: "pinned",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "provenance",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "json" },
    },
    {
      name: "revision",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "s3Key",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 1000 },
    },
    {
      name: "sha256",
      optional: false,
      nullable: false,
      spec: { kind: "string", exactLength: 64, patterns: ["^[a-f0-9]{64}$"] },
    },
    {
      name: "sizeBytes",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "verifiedAt",
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