import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of ApiError, for generated tests. */
export const apiErrorExample: ContractExample = contractExample({
  name: "ApiError",
  fields: [
    {
      name: "code",
      optional: true,
      nullable: false,
      spec: { kind: "number", min: 100, max: 599 },
    },
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