import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of CountryContextDocumentLevels, for generated tests. */
export const countryContextDocumentLevelsExample: ContractExample = contractExample({
  name: "CountryContextDocumentLevels",
  fields: [
    {
      name: "depth",
      optional: false,
      nullable: false,
      spec: { kind: "number", integer: true, min: 0 },
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
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "kindCode",
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
      name: "rootFeatureId",
      optional: false,
      nullable: true,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "routing",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
  ],
  invariants: [],
});
