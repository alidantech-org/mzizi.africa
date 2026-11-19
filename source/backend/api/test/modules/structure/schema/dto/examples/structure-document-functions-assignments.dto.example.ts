import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of StructureDocumentFunctionsAssignments, for generated tests. */
export const structureDocumentFunctionsAssignmentsExample: ContractExample = contractExample({
  name: "StructureDocumentFunctionsAssignments",
  fields: [
    {
      name: "citationId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "institutionId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "share",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "startInstitutionId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "startPositionId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
