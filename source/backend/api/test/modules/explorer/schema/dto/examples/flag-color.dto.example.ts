import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of FlagColor, for generated tests. */
export const flagColorExample: ContractExample = contractExample({
  name: "FlagColor",
  fields: [
    {
      name: "hex",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 7, maxLength: 7 },
    },
    {
      name: "label",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 300 },
    },
    {
      name: "share",
      optional: false,
      nullable: false,
      spec: { kind: "number", min: 0, max: 1 },
    },
  ],
  invariants: [],
});
