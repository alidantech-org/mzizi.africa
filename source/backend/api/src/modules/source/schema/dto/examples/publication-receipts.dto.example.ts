import { type ContractExample, contractExample } from "#/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PublicationReceipts, for generated tests. */
export const publicationReceiptsExample: ContractExample = contractExample({
  name: "PublicationReceipts",
  fields: [
    {
      name: "actorSnapshot",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "json" },
    },
    {
      name: "contractVersion",
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
      name: "deletedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "idempotencyKey",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "payloadHash",
      optional: false,
      nullable: false,
      spec: { kind: "string", exactLength: 64, patterns: ["^[a-f0-9]{64}$"] },
    },
    {
      name: "publicationRefId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "publishedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "requestHash",
      optional: false,
      nullable: false,
      spec: { kind: "string", exactLength: 64, patterns: ["^[a-f0-9]{64}$"] },
    },
    {
      name: "resultManifest",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "json" },
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