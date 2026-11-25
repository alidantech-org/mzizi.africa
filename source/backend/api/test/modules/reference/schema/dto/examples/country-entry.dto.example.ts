import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";
import { countryEntryNamesExample } from "@test/modules/reference/schema/dto/examples/country-entry-names.dto.example.ts";

/** The contract shape of CountryEntry, for generated tests. */
export const countryEntryExample: ContractExample = contractExample({
  name: "CountryEntry",
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
      name: "currencyCode",
      optional: false,
      nullable: true,
      spec: { kind: "string", exactLength: 3, patterns: ["^[A-Z]{3}$"] },
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
      name: "names",
      optional: false,
      nullable: false,
      array: {},
      spec: { kind: "schema", example: () => countryEntryNamesExample },
    },
  ],
  invariants: [],
});
