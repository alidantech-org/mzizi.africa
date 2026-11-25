import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { countryDetailLocalesExample } from "@test/modules/reference/schema/dto/examples/country-detail-locales.dto.example.ts";
import { countryDetailNamesExample } from "@test/modules/reference/schema/dto/examples/country-detail-names.dto.example.ts";

/** The contract shape of CountryDetail, for generated tests. */
export const countryDetailExample: ContractExample = contractExample({
  name: "CountryDetail",
  fields: [
    {
      name: "callingCode",
      optional: false,
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
        patterns: [
          "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ],
      },
    },
    {
      name: "countryId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "currencyId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "designationTerm",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "establishedOn",
      optional: false,
      nullable: true,
      spec: { kind: "temporal", temporal: "date" },
    },
    {
      name: "isoAlpha2",
      optional: false,
      nullable: true,
      spec: { kind: "string", exactLength: 2, patterns: ["^[A-Z]{2}$"] },
    },
    {
      name: "isoAlpha3",
      optional: false,
      nullable: true,
      spec: { kind: "string", exactLength: 3, patterns: ["^[A-Z]{3}$"] },
    },
    {
      name: "isoNumeric",
      optional: false,
      nullable: true,
      spec: { kind: "string", exactLength: 3, patterns: ["^[0-9]{3}$"] },
    },
    {
      name: "locales",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => countryDetailLocalesExample },
    },
    {
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => countryDetailNamesExample },
    },
    {
      name: "recognitionTerm",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
