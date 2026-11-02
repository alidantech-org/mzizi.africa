import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of CreateEvidenceReferenceBody, for generated tests. */
export const createEvidenceReferenceBodyExample: ContractExample = contractExample({
  name: "CreateEvidenceReferenceBody",
  fields: [
    {
      name: "fileId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "note",
      optional: true,
      nullable: true,
      spec: { kind: "string", maxLength: 4000 },
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