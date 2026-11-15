import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";
import { officeDetailHoldersNamesExample } from "#/modules/governance/dto/examples/office-detail-holders-names.dto.example.ts";

/** The contract shape of OfficeDetailHolders, for generated tests. */
export const officeDetailHoldersExample: ContractExample = contractExample({
  name: "OfficeDetailHolders",
  fields: [
    {
      name: "appointment",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255, patterns: ["^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"] },
    },
    {
      name: "individualId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {  },
      spec: { kind: "schema", example: () => officeDetailHoldersNamesExample },
    },
    {
      name: "validFrom",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "validUntil",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
  ],
  invariants: [
  ],
});