import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of InstitutionDetailNames, for generated tests. */
export const institutionDetailNamesExample: ContractExample = contractExample({
  name: "InstitutionDetailNames",
  fields: [
    {
      name: "isPreferred",
      optional: false,
      nullable: false,
      spec: { kind: "boolean" },
    },
    {
      name: "languageId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
  ],
  invariants: [],
});
