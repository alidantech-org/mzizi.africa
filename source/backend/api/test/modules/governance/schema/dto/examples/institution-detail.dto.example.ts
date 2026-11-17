import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import { institutionDetailMandatesExample } from "@test/modules/governance/schema/dto/examples/institution-detail-mandates.dto.example.ts";
import { institutionDetailNamesExample } from "@test/modules/governance/schema/dto/examples/institution-detail-names.dto.example.ts";
import { institutionDetailOfficesExample } from "@test/modules/governance/schema/dto/examples/institution-detail-offices.dto.example.ts";

/** The contract shape of InstitutionDetail, for generated tests. */
export const institutionDetailExample: ContractExample = contractExample({
  name: "InstitutionDetail",
  fields: [
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
      name: "fromToPrecision",
      optional: false,
      nullable: true,
      spec: { kind: "enum", values: Object.values(DatePrecision) },
    },
    {
      name: "fromYear",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
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
      name: "mandates",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => institutionDetailMandatesExample },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => institutionDetailNamesExample },
    },
    {
      name: "offices",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => institutionDetailOfficesExample },
    },
    {
      name: "toYear",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: -10000, max: 3000 },
    },
  ],
  invariants: [],
});
