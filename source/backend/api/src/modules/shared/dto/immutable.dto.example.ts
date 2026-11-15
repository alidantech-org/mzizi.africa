import { type ContractExample, contractExample } from "#/modules/common/dto/testing/examples.ts";

/** The contract shape of Immutable, for generated tests. */
export const immutableExample: ContractExample = contractExample({
  name: "Immutable",
  fields: [
    {
      name: "id",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [
  ],
});