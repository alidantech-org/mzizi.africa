import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ContextCountry, for generated tests. */
export const contextCountryExample: ContractExample = contractExample({
  name: "ContextCountry",
  fields: [
    {
      name: "code",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "currencyCode",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "defaultLanguageCode",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "isServed",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "isoCode",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "subdomain",
      optional: true,
      nullable: true,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
  ],
  invariants: [],
});
