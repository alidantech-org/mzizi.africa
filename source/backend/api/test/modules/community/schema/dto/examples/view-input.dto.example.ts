import {
  type ContractExample,
  contractExample,
} from "@test/modules/common/schema/dto/testing/examples.ts";

/** The contract shape of ViewInput, for generated tests. */
export const viewInputExample: ContractExample = contractExample({
  name: "ViewInput",
  fields: [
    {
      name: "subjectCode",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 255 },
    },
    {
      name: "visitor",
      optional: false,
      nullable: false,
      spec: { kind: "string", minLength: 1, maxLength: 600 },
    },
  ],
  invariants: [],
});
