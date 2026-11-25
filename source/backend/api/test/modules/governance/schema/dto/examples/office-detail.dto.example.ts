import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { officeDetailHoldersExample } from "@test/modules/governance/schema/dto/examples/office-detail-holders.dto.example.ts";
import { officeDetailNamesExample } from "@test/modules/governance/schema/dto/examples/office-detail-names.dto.example.ts";

/** The contract shape of OfficeDetail, for generated tests. */
export const officeDetailExample: ContractExample = contractExample({
  name: "OfficeDetail",
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
      spec: { kind: "schema", example: () => officeDetailHoldersExample },
    },
    {
      name: "institutionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => officeDetailNamesExample },
    },
    {
      name: "officeId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "positionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
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
  ],
  invariants: [],
});
