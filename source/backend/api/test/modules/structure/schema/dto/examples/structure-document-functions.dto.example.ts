import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { structureDocumentFunctionsAssignmentsExample } from "@test/modules/structure/schema/dto/examples/structure-document-functions-assignments.dto.example.ts";

/** The contract shape of StructureDocumentFunctions, for generated tests. */
export const structureDocumentFunctionsExample: ContractExample = contractExample({
  name: "StructureDocumentFunctions",
  fields: [
    {
      name: "assignments",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => structureDocumentFunctionsAssignmentsExample,
      },
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
      name: "parentId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
