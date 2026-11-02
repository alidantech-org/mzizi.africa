import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of CreateEvidenceReferenceBody, for generated tests. */
export const createEvidenceReferenceBodyExample: ContractExample = contractExample({
  name: "CreateEvidenceReferenceBody",
  fields: [
    {
      name: "artifactChecksum",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 64, maxLength: 64 },
    },
    {
      name: "artifactId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "mediaType",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 3, maxLength: 200 },
    },
    {
      name: "note",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
    },
    {
      name: "sizeBytes",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "targetId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "targetKind",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 100 },
    },
  ],
  invariants: [
  ],
});