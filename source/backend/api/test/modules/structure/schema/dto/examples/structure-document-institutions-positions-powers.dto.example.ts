import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of StructureDocumentInstitutionsPositionsPowers, for generated tests. */
export const structureDocumentInstitutionsPositionsPowersExample: ContractExample = contractExample(
  {
    name: "StructureDocumentInstitutionsPositionsPowers",
    fields: [
      {
        name: "binding",
        optional: false,
        nullable: false,
        spec: { kind: "boolean" },
      },
      {
        name: "citationId",
        optional: false,
        nullable: true,
        spec: { kind: "string", format: "uuid" },
      },
      {
        name: "code",
        optional: false,
        nullable: false,
        spec: {
          kind: "string",
          minLength: 1,
          maxLength: 255,
          patterns: [
            "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
          ],
        },
      },
      {
        name: "id",
        optional: false,
        nullable: false,
        spec: { kind: "string", format: "uuid" },
      },
      {
        name: "kind",
        optional: false,
        nullable: false,
        spec: { kind: "string", minLength: 1, maxLength: 300 },
      },
      {
        name: "procedureId",
        optional: false,
        nullable: true,
        spec: { kind: "string", format: "uuid" },
      },
      {
        name: "step",
        optional: false,
        nullable: true,
        spec: { kind: "number", integer: true, min: 1 },
      },
      {
        name: "targetInstitutionId",
        optional: false,
        nullable: true,
        spec: { kind: "string", format: "uuid" },
      },
      {
        name: "targetPositionId",
        optional: false,
        nullable: true,
        spec: { kind: "string", format: "uuid" },
      },
    ],
    invariants: [],
  },
);
