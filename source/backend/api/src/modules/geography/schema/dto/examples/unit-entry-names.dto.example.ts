import { type ContractExample, contractExample } from "#/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of UnitEntryNames, for generated tests. */
export const unitEntryNamesExample: ContractExample = contractExample({
  name: "UnitEntryNames",
  fields: [
    {
      name: "languageTag",
      optional: false,
      nullable: true,
      spec: { kind: "string", minLength: 2, maxLength: 35 },
    },
    {
      name: "name",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
  ],
  invariants: [
  ],
});