import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of StructureDocumentInstitutionsPositionsOffices, for generated tests. */
export const structureDocumentInstitutionsPositionsOfficesExample: ContractExample =
  contractExample({
    name: "StructureDocumentInstitutionsPositionsOffices",
    fields: [
      {
        name: "abolishedOn",
        optional: false,
        nullable: true,
        spec: { kind: "temporal", temporal: "date" },
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
        name: "featureId",
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
        name: "ordinal",
        optional: false,
        nullable: true,
        spec: { kind: "number", integer: true, min: 1 },
      },
    ],
    invariants: [],
  });
