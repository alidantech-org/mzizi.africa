import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of BootstrapInput, for generated tests. */
export const bootstrapInputExample: ContractExample = contractExample({
  name: "BootstrapInput",
  fields: [
    {
      name: "languageCode",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 2, maxLength: 35 },
    },
  ],
  invariants: [],
});
