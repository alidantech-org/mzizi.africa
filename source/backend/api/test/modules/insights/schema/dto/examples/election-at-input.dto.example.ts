import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ElectionAtInput, for generated tests. */
export const electionAtInputExample: ContractExample = contractExample({
  name: "ElectionAtInput",
  fields: [
    {
      name: "contestKind",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 100 },
    },
    {
      name: "countryCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", exactLength: 2, patterns: ["^[A-Z]{2}$"] },
    },
    {
      name: "electionId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "languageCode",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 35 },
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
