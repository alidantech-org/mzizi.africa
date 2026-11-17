import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of CitationInput, for generated tests. */
export const citationInputExample: ContractExample = contractExample({
  name: "CitationInput",
  fields: [
    {
      name: "citationId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [],
});
