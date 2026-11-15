import { type ContractExample, contractExample } from "#/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of PageWindow, for generated tests. */
export const pageWindowExample: ContractExample = contractExample({
  name: "PageWindow",
  fields: [
    {
      name: "limit",
      optional: true,
      nullable: false,
      spec: { kind: "number", integer: true },
    },
    {
      name: "offset",
      optional: true,
      nullable: false,
      spec: { kind: "number", integer: true },
    },
  ],
  invariants: [
  ],
});