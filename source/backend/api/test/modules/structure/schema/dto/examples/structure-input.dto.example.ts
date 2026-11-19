import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of StructureInput, for generated tests. */
export const structureInputExample: ContractExample = contractExample({
  name: "StructureInput",
  fields: [
    {
      name: "countryCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", exactLength: 2, patterns: ["^[A-Z]{2}$"] },
    },
  ],
  invariants: [],
});
