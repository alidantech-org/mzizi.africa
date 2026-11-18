import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of MotionsInput, for generated tests. */
export const motionsInputExample: ContractExample = contractExample({
  name: "MotionsInput",
  fields: [
    {
      name: "institutionId",
      optional: true,
      nullable: false,
      spec: { kind: "string", format: "uuid" },
    },
    {
      name: "limit",
      optional: true,
      nullable: false,
      spec: { kind: "number", integer: true, min: 1, max: 500 },
    },
  ],
  invariants: [],
});
