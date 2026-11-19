import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { structureDocumentInstitutionsNamesExample } from "@test/modules/structure/schema/dto/examples/structure-document-institutions-names.dto.example.ts";
import { structureDocumentInstitutionsPositionsExample } from "@test/modules/structure/schema/dto/examples/structure-document-institutions-positions.dto.example.ts";
import { structureDocumentInstitutionsPowersExample } from "@test/modules/structure/schema/dto/examples/structure-document-institutions-powers.dto.example.ts";

/** The contract shape of StructureDocumentInstitutions, for generated tests. */
export const structureDocumentInstitutionsExample: ContractExample = contractExample({
  name: "StructureDocumentInstitutions",
  fields: [
    {
      name: "arm",
      optional: false,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
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
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => structureDocumentInstitutionsNamesExample,
      },
    },
    {
      name: "positions",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => structureDocumentInstitutionsPositionsExample,
      },
    },
    {
      name: "powers",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => structureDocumentInstitutionsPowersExample,
      },
    },
  ],
  invariants: [],
});
