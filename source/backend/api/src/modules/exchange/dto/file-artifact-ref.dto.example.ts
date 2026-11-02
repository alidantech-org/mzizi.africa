import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of FileArtifactRef, for generated tests. */
export const fileArtifactRefExample: ContractExample = contractExample({
  name: "FileArtifactRef",
  fields: [
    {
      name: "captureId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "contentHash",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 64, maxLength: 64 },
    },
    {
      name: "documentId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "fileVersionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "mimeType",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "retrievedAt",
      optional: true,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "sizeBytes",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "sourceUrl",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "url", maxLength: 1000 },
    },
  ],
  invariants: [
  ],
});