import { type ContractExample, contractExample } from "#/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of UnitKey, for generated tests. */
export const unitKeyExample: ContractExample = contractExample({
  name: "UnitKey",
  fields: [
    {
      name: "featureId",
      optional: false,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
  ],
  invariants: [
  ],
});