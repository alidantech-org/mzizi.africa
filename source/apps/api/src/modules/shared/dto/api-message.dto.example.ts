import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of ApiMessage, for generated tests. */
export const apiMessageExample: ContractExample = contractExample({
  name: "ApiMessage",
  fields: [
    {
      name: "message",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 500 },
    },
  ],
  invariants: [
  ],
});