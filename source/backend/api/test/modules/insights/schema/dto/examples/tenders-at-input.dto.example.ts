import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of TendersAtInput, for generated tests. */
export const tendersAtInputExample: ContractExample = contractExample({
  name: "TendersAtInput",
  fields: [
    {
      name: "countryCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", exactLength: 2, patterns: ["^[A-Z]{2}$"] },
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
      spec: { kind: "number", integer: true, min: 1, max: 500 },
    },
    {
      name: "path",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 1500 },
    },
    {
      name: "status",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
  ],
  invariants: [],
});
