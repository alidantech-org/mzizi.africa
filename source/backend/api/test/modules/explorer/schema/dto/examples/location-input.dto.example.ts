import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of LocationInput, for generated tests. */
export const locationInputExample: ContractExample = contractExample({
  name: "LocationInput",
  fields: [
    {
      name: "countryCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", exactLength: 2, patterns: ["^[A-Z]{2}$"] },
    },
    {
      name: "find",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 100 },
    },
    {
      name: "kindCode",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "languageCode",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 35 },
    },
    {
      name: "limit",
      optional: true,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1, max: 100 },
    },
    {
      name: "page",
      optional: true,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1 },
    },
    {
      name: "path",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 1500 },
    },
  ],
  invariants: [],
});
