import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { structureDocumentInstitutionsPositionsOfficesExample } from "@test/modules/structure/schema/dto/examples/structure-document-institutions-positions-offices.dto.example.ts";
import { structureDocumentInstitutionsPositionsPowersExample } from "@test/modules/structure/schema/dto/examples/structure-document-institutions-positions-powers.dto.example.ts";

/** The contract shape of StructureDocumentInstitutionsPositions, for generated tests. */
export const structureDocumentInstitutionsPositionsExample: ContractExample = contractExample({
  name: "StructureDocumentInstitutionsPositions",
  fields: [
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
      name: "fixedSeats",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "offices",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => structureDocumentInstitutionsPositionsOfficesExample,
      },
    },
    {
      name: "powers",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => structureDocumentInstitutionsPositionsPowersExample,
      },
    },
    {
      name: "role",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "seatBasisCode",
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
      name: "seatBasisLabel",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "selectionCode",
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
      name: "selectionLabel",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "termLimit",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "termYears",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "title",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "unitLevelId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
