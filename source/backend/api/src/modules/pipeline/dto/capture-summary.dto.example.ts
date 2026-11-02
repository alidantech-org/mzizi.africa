import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of CaptureSummary, for generated tests. */
export const captureSummaryExample: ContractExample = contractExample({
  name: "CaptureSummary",
  fields: [
    {
      name: "contentHash",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "documentId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "documentTitle",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 0, maxLength: 5000 },
    },
    {
      name: "httpStatus",
      optional: true,
      nullable: true,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "retrievedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
    },
    {
      name: "retrievedUrl",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 0, maxLength: 5000 },
    },
    {
      name: "siteId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "tool",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 0, maxLength: 5000 },
    },
  ],
  invariants: [
  ],
});