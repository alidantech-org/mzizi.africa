import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { structureDocumentFunctionsExample } from "@test/modules/structure/schema/dto/examples/structure-document-functions.dto.example.ts";
import { structureDocumentInstitutionsExample } from "@test/modules/structure/schema/dto/examples/structure-document-institutions.dto.example.ts";
import { structureDocumentProceduresExample } from "@test/modules/structure/schema/dto/examples/structure-document-procedures.dto.example.ts";

/** The contract shape of StructureDocument, for generated tests. */
export const structureDocumentExample: ContractExample = contractExample({
  name: "StructureDocument",
  fields: [
    {
      name: "countryCode",
      optional: false,
      nullable: true,
      spec: { kind: "string", exactLength: 2, patterns: ["^[A-Z]{2}$"] },
    },
    {
      name: "countryId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "countryName",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "functions",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => structureDocumentFunctionsExample,
      },
    },
    {
      name: "institutions",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => structureDocumentInstitutionsExample,
      },
    },
    {
      name: "procedures",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => structureDocumentProceduresExample,
      },
    },
  ],
  invariants: [],
});
