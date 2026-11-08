import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of StructureVersionSummary, for generated tests. */
export const structureVersionSummaryExample: ContractExample = contractExample({
  name: "StructureVersionSummary",
  fields: [
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "date-time" },
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
      name: "notes",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 0, maxLength: 5000 },
    },
    {
      name: "number",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1000 },
    },
    {
      name: "purpose",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "schemaVersion",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "status",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "structureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [
  ],
});