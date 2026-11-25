import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { institutionDetailOfficesHoldersExample } from "@test/modules/governance/schema/dto/examples/institution-detail-offices-holders.dto.example.ts";
import { institutionDetailOfficesNamesExample } from "@test/modules/governance/schema/dto/examples/institution-detail-offices-names.dto.example.ts";

/** The contract shape of InstitutionDetailOffices, for generated tests. */
export const institutionDetailOfficesExample: ContractExample = contractExample({
  name: "InstitutionDetailOffices",
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
      name: "featureId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "holders",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => institutionDetailOfficesHoldersExample,
      },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: {
        kind: "schema",
        example: () => institutionDetailOfficesNamesExample,
      },
    },
    {
      name: "officeId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "order",
      optional: false,
      nullable: true,
      spec: { kind: "number", integer: true, min: 0 },
    },
    {
      name: "roleTerm",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "seat",
      optional: false,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
  ],
  invariants: [],
});
