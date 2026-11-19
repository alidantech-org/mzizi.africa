import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of LawInput, for generated tests. */
export const lawInputExample: ContractExample = contractExample({
  name: "LawInput",
  fields: [
    {
      name: "kindCode",
      optional: true,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 200 },
    },
  ],
  invariants: [],
});
