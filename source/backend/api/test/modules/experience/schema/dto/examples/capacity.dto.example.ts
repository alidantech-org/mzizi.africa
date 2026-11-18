import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of Capacity, for generated tests. */
export const capacityExample: ContractExample = contractExample({
  name: "Capacity",
  fields: [
    {
      name: "indicatorCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "label",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "value",
      optional: false,
      nullable: false,
      spec: { kind: "number" },
    },
  ],
  invariants: [],
});
