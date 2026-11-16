import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { valueExample } from "@test/modules/reference/schema/dto/examples/value.dto.example.ts";
import { codedEntityExample } from "@test/modules/shared/schema/dto/examples/coded-entity.dto.example.ts";

/** The contract shape of Country, for generated tests. */
export const countryExample: ContractExample = contractExample({
  name: "Country",
  fields: [
    {
      name: "callingCode",
      optional: true,
      nullable: true,
      spec: {
        kind: "string",
        minLength: 2,
        maxLength: 5,
        patterns: ["^\\+[0-9]{1,4}$"],
      },
    },
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: {
        kind: "string",
        minLength: 1,
        maxLength: 255,
        patterns: ["^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$"],
      },
    },
    {
      name: "continentId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "createdAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "currencyId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "deletedAt",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "designationId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "establishedOn",
      optional: true,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "isoAlpha2",
      optional: true,
      nullable: true,
      spec: { kind: "string", exactLength: 2, patterns: ["^[A-Z]{2}$"] },
    },
    {
      name: "isoAlpha3",
      optional: true,
      nullable: true,
      spec: { kind: "string", exactLength: 3, patterns: ["^[A-Z]{3}$"] },
    },
    {
      name: "isoNumeric",
      optional: true,
      nullable: true,
      spec: { kind: "string", exactLength: 3, patterns: ["^[0-9]{3}$"] },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "officialName",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "recognitionStatusId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "subregionId",
      optional: true,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "updatedAt",
      optional: false,
      nullable: false,
      spec: { kind: "temporal", temporal: "instant" },
    },
    {
      name: "version",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
  ],
  invariants: [],
});
